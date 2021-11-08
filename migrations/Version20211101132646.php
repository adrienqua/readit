<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211101132646 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE vote ADD test INT DEFAULT NULL, CHANGE is_up is_up TINYINT(1) DEFAULT \'0\', CHANGE is_down is_down TINYINT(1) DEFAULT \'0\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE vote DROP test, CHANGE is_up is_up TINYINT(1) DEFAULT \'0\' NOT NULL, CHANGE is_down is_down TINYINT(1) DEFAULT \'0\' NOT NULL');
    }
}
