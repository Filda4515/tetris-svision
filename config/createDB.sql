CREATE DATABASE IF NOT EXISTS `tetris`;
USE tetris;

CREATE TABLE IF NOT EXISTS rg_tetris_hallOfFame (
  `ndx` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `name` CHAR(64) NOT NULL,
  `score` BIGINT(20) NOT NULL,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ndx`),
  INDEX `score` (`score`),
  INDEX `name` (`name`),
  INDEX `created` (`created`)
);