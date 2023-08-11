<?php

if (\file_exists(get_stylesheet_directory() . '/vendor/autoload.php')) {
    require_once 'vendor/autoload.php';
}

# Must read first
require_once 'functions/includes/env_reader.php';
require_once 'functions/constants.php';


require_once 'functions/setup.php';
ec_include_folder('functions/includes');
