<?php

if (\file_exists(get_stylesheet_directory() . '/vendor/autoload.php')) {
    require_once 'vendor/autoload.php';
}

require_once 'functions/setup.php';
require_once 'functions/includes/include_folder.php';

elmgren_include_folder('functions/includes');
