<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use App\Repository\VoteRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource(
 *     normalizationContext={"groups"={"vote:read"}},
 *     denormalizationContext={"groups"={"vote:write"}})
 * @ORM\Entity(repositoryClass=VoteRepository::class)
 */
class Vote
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"vote:read", "article:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"vote:read", "vote:write", "article:read"})
     */
    private $isUp;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"vote:read", "vote:write", "article:read"})
     */
    private $isDown;




    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="votes")
     * 
     * @Groups({"vote:read", "vote:write", "article:read"})
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity=Article::class, inversedBy="votes")
     * @Groups({"vote:read", "vote:write"})
     */
    private $article;


    
    public function __construct()
    {
        $this->isUp = false;
        $this->isDown = false;

    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIsUp(): ?bool
    {
        return $this->isUp;
    }

    public function setIsUp(bool $isUp): self
    {
        $this->isUp = $isUp;

        return $this;
    }

    public function getIsDown(): ?bool
    {
        return $this->isDown;
    }

    public function setIsDown(bool $isDown): self
    {
        $this->isDown = $isDown;

        return $this;
    }


    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

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
}
