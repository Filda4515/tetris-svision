<?php

class DataCommand {
   public function execute($postData) {
      $data = json_decode($postData);
      $mysqli = new mysqli($GLOBALS['dbHostname'], $GLOBALS['dbUser'], $GLOBALS['dbPassword'], $GLOBALS['dbName']);

      $safeName = $mysqli->real_escape_string($data->name);
      $mysqli->query(sprintf("INSERT INTO `rg_tetris_hallOfFame` (`name`, `score`, `created`) VALUES ('%s', %d, NOW())", $safeName, $data->score));

      $data = $mysqli->query('SELECT `score` FROM `rg_tetris_hallOfFame` ORDER BY `score` DESC LIMIT 1');
      $mysqli->close();
      
      $result = [];
      $result['hiScore'] = 0;
      if ($row = $data->fetch_object()) {
         $result['hiScore'] = $row->score;
      }
      return $result;
   } // execute
} // class DataCommand