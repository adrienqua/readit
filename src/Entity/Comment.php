<?php

namespace App\Entity;

use Assert\NotBlank;
use Assert\Length;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CommentRepository;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     normalizationContext={"groups"={"comment:read"}},
 *     denormalizationContext={"groups"={"comment:write"}}
 * )
 * @ORM\Entity(repositoryClass=CommentRepository::class)
 */
class Comment
{

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     *
     * @Groups({"comment:read", "article:read"})
     */
    private $id;


    /**
     * @ORM\Column(type="text")
     * @Assert\NotBlank(message="Le titre est obligatoire.")
     * @Assert\Length(
     *      min = 3,
     *      max = 400,
     *      minMessage = "Ce champ doit contenir plus de {{ limit }} caractères",
     *      maxMessage = "Ce champ doit contenir moins de {{ limit }} caractères",
     *      allowEmptyString = false
     * )
     * @Groups({"comment:read", "comment:write", "article:read"})
     */
    private $content;

    /**
     * @ORM\Column(type="datetime_immutable")
     *
     * @Groups({"comment:read", "article:read"})
     */
    private $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity=Article::class, inversedBy="comments")
     *
     * @Groups("comment:write")
     */
    private $article;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="comments")
     * @ORM\JoinColumn(nullable=false)
     *
     * @Groups({"comment:read", "comment:write"})
     */
    private $author;

    /**
     * @ORM\OneToMany(targetEntity=Vote::class, mappedBy="comment", orphanRemoval=true)
     * @ApiSubresource
     * @Groups({"comment:read", "comment:write"})
     */
    private $votes;

    /**
     * @ORM\Column(type="integer", nullable=true)
     *
     * @Groups({"comment:read", "comment:write"})
     */
    private $score;





    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->votes = new ArrayCollection();
        $this->score = 0;
    }


    public function getId(): ?int
    {
        return $this->id;
    }


    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getArticle(): ?Article
    {
        return $this->article;
    }

    public function setArticle(?Article $article): self
    {
        $this->article = $article;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;

        return $this;
    }

    /**
     * @return Collection|Vote[]
     */
    public function getVotes(): Collection
    {
        return $this->votes;
    }

    public function addVote(Vote $vote): self
    {
        if (!$this->votes->contains($vote)) {
            $this->votes[] = $vote;
            $vote->setComment($this);
        }

        return $this;
    }

    public function removeVote(Vote $vote): self
    {
        if ($this->votes->removeElement($vote)) {
            // set the owning side to null (unless already changed)
            if ($vote->getComment() === $this) {
                $vote->setComment(null);
            }
        }

        return $this;
    }

    public function getScore(): ?int
    {
        return $this->score;
    }

    public function setScore(?int $score): self
    {
        $this->score = $score;

        return $this;
    }
}
