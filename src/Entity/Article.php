<?php

namespace App\Entity;

use Assert\NotBlank;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\ArticleRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\ArticlePictureController;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Symfony\Component\HttpFoundation\File\File;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(
 *  attributes={"order"={"id": "DESC"}},
 *  normalizationContext={"groups"={"article:read"}},
 *  denormalizationContext={"groups"={"article:write"}},
 *  collectionOperations={
 *      "get"={},
 *      "post"={},
 *      },
 *   itemOperations={
 *      "put"={},
 *      "delete"={},
 *      "get"={},
 *      "picture"={
 *          "method" = "POST",
 *          "path" = "/articles/{id}/picture",
 *          "deserialize" = false,
 *          "controller" = App\Controller\ArticlePictureController::class
 *      },
 *      }
 *
 * )
 * @ApiFilter(SearchFilter::class, properties={"favorites.user.id": "exact", })
 * @ORM\Entity(repositoryClass=ArticleRepository::class)
 * @Vich\Uploadable()
 */


class Article
{

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     *
     * @Groups("article:read", "favorite:read")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Le titre est obligatoire.")
     * @Groups({"article:read", "article:write"})
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=255)
     *
     * @Groups("article:read")
     *
     */
    private $slug;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Assert\NotBlank(message="Le contenu est obligatoire.")
     * @Groups({"article:read", "article:write"})
     */
    private $content;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     *
     * @Groups("article:read")
     */
    private $picture;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     *
     * @Groups("article:read")
     */
    private $pictureUrl;



    /**
     * NOTE: This is not a mapped field of entity metadata, just a simple property.
     *
     * @Vich\UploadableField(mapping="article_image", fileNameProperty="picture")
     *
     * @var File|null
     */
    private $imageFile;

    /**
     * @ORM\Column(type="boolean")
     *
     * @Groups("article:read")
     */
    private $isPublished;

    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     *
     * @Groups("article:read")
     */
    private $publishedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     *
     * @Groups("article:read")
     */
    private $updatedAt;


    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     *
     * @Groups("article:read")
     */
    private $createdAt;

    /**
     * @ORM\OneToMany(targetEntity=Comment::class, mappedBy="article", orphanRemoval=true)
     * @ApiSubresource
     *
     * @Groups("article:read")
     */
    private $comments;

    /**
     * @ORM\ManyToMany(targetEntity=Tag::class, inversedBy="articles")
     * @Assert\Count(min = "1", minMessage="Sélectionnez au moins une catégorie.")
     * @Groups({"article:read", "article:write"})
     */
    private $tags;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="articles")
     * @Assert\NotBlank(message="L'utilisateur n'est pas défini.")
     * @Groups({"article:read", "article:write"})
     */
    private $author;

    /**
     * @ORM\Column(type="integer", nullable=true)
     *
     * @Groups({"article:read", "article:write"})
     */
    private $score;

    /**
     * @ORM\OneToMany(targetEntity=Vote::class, mappedBy="article", orphanRemoval=true)
     * @ApiSubresource
     * @Groups("article:read")
     */
    private $votes;

    /**
     * @ORM\OneToMany(targetEntity=Favorite::class, mappedBy="article")
     *
     * @Groups({"article:read", "article:write"})
     */
    private $favorites;



    public function __construct()
    {
        $this->isPublished = false;
        $this->score = 0;
        $this->createdAt = new \DateTimeImmutable();
        $this->comments = new ArrayCollection();
        $this->tags = new ArrayCollection();
        $this->votes = new ArrayCollection();
        $this->favorites = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function setImageFile(File $picture = null)
    {
        $this->imageFile = $picture;

        // VERY IMPORTANT:
        // It is required that at least one field changes if you are using Doctrine,
        // otherwise the event listeners won't be called and the file is lost
        if ($picture) {
            // if 'updatedAt' is not defined in your entity, use another property
            $this->updatedAt = new \DateTime('now');
        }
    }

    public function getImageFile()
    {
        return $this->imageFile;
    }

    

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(?string $picture): self
    {
        $this->picture = $picture;

        return $this;
    }
    

    public function getPictureUrl(): ?string
    {
        return $this->pictureUrl;
    }

    public function setpictureUrl(?string $pictureUrl): self
    {
        $this->pictureUrl = $pictureUrl;

        return $this;
    }

    public function getIsPublished(): ?bool
    {
        return $this->isPublished;
    }

    public function setIsPublished(bool $isPublished): self
    {
        $this->isPublished = $isPublished;

        return $this;
    }

    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(?\DateTimeImmutable $publishedAt): self
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTime $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

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

    /**
     * @return Collection|Comment[]
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments[] = $comment;
            $comment->setArticle($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getArticle() === $this) {
                $comment->setArticle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Tag[]
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(Tag $tag): self
    {
        if (!$this->tags->contains($tag)) {
            $this->tags[] = $tag;
        }

        return $this;
    }

    public function removeTag(Tag $tag): self
    {
        $this->tags->removeElement($tag);

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

    public function getScore(): ?int
    {
        return $this->score;
    }

    public function setScore(?int $score): self
    {
        $this->score = $score;

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
            $vote->setArticle($this);
        }

        return $this;
    }

    public function removeVote(Vote $vote): self
    {
        if ($this->votes->removeElement($vote)) {
            // set the owning side to null (unless already changed)
            if ($vote->getArticle() === $this) {
                $vote->setArticle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Favorite[]
     */
    public function getFavorites(): Collection
    {
        return $this->favorites;
    }

    public function addFavorite(Favorite $favorite): self
    {
        if (!$this->favorites->contains($favorite)) {
            $this->favorites[] = $favorite;
            $favorite->setArticle($this);
        }

        return $this;
    }

    public function removeFavorite(Favorite $favorite): self
    {
        if ($this->favorites->removeElement($favorite)) {
            // set the owning side to null (unless already changed)
            if ($favorite->getArticle() === $this) {
                $favorite->setArticle(null);
            }
        }

        return $this;
    }
}
