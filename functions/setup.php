<?php

// Register blocks
function register_acf_blocks()
{
    $blocks = array_diff(scandir(get_stylesheet_directory() . '/blocks/', 1), array('..', '.'));

    foreach ($blocks as $block) {
        $dir = get_stylesheet_directory() . '/blocks/' . $block;
        $file = $dir . '/settings.php';
        if(\file_exists($file)){
            require_once $dir . '/settings.php';
            register_block_type($dir);
        }
    }
}
add_action('init', 'register_acf_blocks');

// Register styles and scripts
function pp_enqueue_styles_and_scripts() {
    $dist_path = get_stylesheet_directory() . '/dist/';

    // Enqueue styles.
    foreach (glob($dist_path . 'css/*.css') as $file) {
        $file_url = get_stylesheet_directory_uri() . '/dist/css/' . basename($file);
        wp_enqueue_style(basename($file), $file_url);
    }

    // Enqueue scripts.
    foreach (glob($dist_path . 'js/*.js') as $file) {
        $file_url = get_stylesheet_directory_uri() . '/dist/js/' . basename($file);
        wp_enqueue_script(basename($file), $file_url, array(), null, true);
    }

    // Enqueue jQuery
    wp_enqueue_script('jquery');
}
add_action('wp_enqueue_scripts', 'pp_enqueue_styles_and_scripts');
add_action('admin_enqueue_scripts', 'pp_enqueue_styles_and_scripts');