<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\FavoriteRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(
 *     normalizationContext={"groups"={"favorite:read"}},
 *     denormalizationContext={"groups"={"favorite:write"}}
 * )
 * @ApiFilter(SearchFilter::class, properties={"user.id": "exact", "article.id": "exact"})
 *
 * @ORM\Entity(repositoryClass=FavoriteRepository::class)
 */
class Favorite
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     *
     * @Groups("favorite:read")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="favorites")
     * @ORM\JoinColumn(nullable=false)
     *
     * @Groups({"favorite:read","favorite:write"})
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity=Article::class, inversedBy="favorites")
     *
     * @Groups({"favorite:read","favorite:write"})
     *
     */
    private $article;

    /**
     * @ORM\Column(type="boolean")
     *
     * @Groups({"favorite:read","favorite:write"})
     */
    private $isActive;

    public function __construct()
    {
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getIsActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }
}
