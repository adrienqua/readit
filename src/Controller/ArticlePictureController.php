<?php

namespace  App\Controller;

use App\Entity\Article;
use Symfony\Component\HttpFoundation\Request;


class ArticlePictureController {

    public function __invoke(Request $request) {

        $article = $request->attributes->get('data');
        if (!($article instanceof Article)) {
            throw new \RuntimeException('Upload erreur');
        }
        $article->setImageFile($request->files->get('file'));
        $article->setUpdatedAt(new \DateTime());
        return $article;
    }
}