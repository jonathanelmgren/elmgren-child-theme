<?php

function parse_env_file($file){
    if(!is_file($file) || !is_readable($file)){
        return false;
    }

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach($lines as $line){
        if(strpos(trim($line), '#') === 0){
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        if(!array_key_exists($name, $_SERVER)){
            putenv(sprintf('%s=%s', $name, $value));
        }
    }
}

// Call the function to load the .env file
parse_env_file(get_stylesheet_directory() . '/.env');
