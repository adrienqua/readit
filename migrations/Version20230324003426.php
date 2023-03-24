<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230324003426 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE favorite_article');
        $this->addSql('ALTER TABLE favorite ADD article_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE favorite ADD CONSTRAINT FK_68C58ED97294869C FOREIGN KEY (article_id) REFERENCES article (id)');
        $this->addSql('CREATE INDEX IDX_68C58ED97294869C ON favorite (article_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE favorite_article (favorite_id INT NOT NULL, article_id INT NOT NULL, INDEX IDX_5F6EA008AA17481D (favorite_id), INDEX IDX_5F6EA0087294869C (article_id), PRIMARY KEY(favorite_id, article_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE favorite_article ADD CONSTRAINT FK_5F6EA0087294869C FOREIGN KEY (article_id) REFERENCES article (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE favorite_article ADD CONSTRAINT FK_5F6EA008AA17481D FOREIGN KEY (favorite_id) REFERENCES favorite (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE favorite DROP FOREIGN KEY FK_68C58ED97294869C');
        $this->addSql('DROP INDEX IDX_68C58ED97294869C ON favorite');
        $this->addSql('ALTER TABLE favorite DROP article_id');
    }
}
