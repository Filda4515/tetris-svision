<?php
  $appName = 'Tetris';
  $appDescription = 'Play classic Tetris online for free in your browser. A faithful web-based remake with no download required.';
  $appPrefix = 'tetris';

  $appNoscript =
    '<h1>Tetris</h1>'.
    '<p>A modern web-based remake of the legendary block-stacking puzzle game originally created by Alexey Pajitnov in 1984. '.
    'Rotate and place falling Tetrominoes to clear lines, score points, and survive as the speed increases!</p>'.
    '<p>There is nothing to install and nothing to download — just open the page and play. '.
    'Please enable JavaScript to start the game.</p>';

  $appJsonLd = [
    'genre' => 'Puzzle game',
    'isBasedOn' => [
      '@type' => 'VideoGame',
      'name' => 'Tetris',
      'author' => ['@type' => 'Person', 'name' => 'Alexey Pajitnov'],
      'datePublished' => '1984',
    ],
  ];

  $devMode = false;
  require_once 'config/config.php';
  require_once 'app/svision/php/main.php';
