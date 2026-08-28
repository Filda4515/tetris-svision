<?php
  $appName = 'Tetris';
  $appDescription = 'Play classic Tetris online for free in your browser. A faithful web-based remake with no download required.';
  $appPrefix = 'tetris';

  $appNoscript =
    '<h1>Tetris</h1>'.
    '<p>A modern web-based remake of the legendary block-stacking puzzle game originally created by Alexey Pajitnov in 1984. '.
    'This version faithfully recreates the authentic look and feel of the classic 1987 Mirrorsoft 48K edition for the ZX Spectrum.</p>'.
    '<p>There is nothing to install and nothing to download — just open the page and play. '.
    'Please enable JavaScript to start the game.</p>';

  $appJsonLd = [
    'genre' => 'Puzzle game',
    'isBasedOn' => [
      '@type' => 'VideoGame',
      'name' => 'Tetris',
      'author' => ['@type' => 'Person', 'name' => 'Alexey Pajitnov'],
      'publisher' => ['@type' => 'Organization', 'name' => 'Mirrorsoft'],
      'datePublished' => '1987',
      'gamePlatform' => 'ZX Spectrum',
    ],
  ];

  $devMode = false;

  require_once 'config/config.php';
  require_once 'app/svision/php/main.php';
