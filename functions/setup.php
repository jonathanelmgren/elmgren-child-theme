<?php

// Register blocks
function ec_register_acf_blocks()
{
    $blocks = array_diff(scandir(get_stylesheet_directory() . '/blocks/', 1), array('..', '.'));

    foreach ($blocks as $block) {
        $dir = get_stylesheet_directory() . '/blocks/' . $block;
        $file = $dir . '/settings.php';
        if (\file_exists($file)) {
            require_once $dir . '/settings.php';
            register_block_type($dir);
        }
    }
}
add_action('init', 'ec_register_acf_blocks');

// Register styles and scripts
function ec_enqueue_styles_and_scripts()
{
    $dist_path = get_stylesheet_directory() . '/dist/';

    // Enqueue styles.
    foreach (glob($dist_path . 'css/*.css') as $file) {
        $handle = 'child-' . basename($file, '.css');
        $file_url = get_stylesheet_directory_uri() . '/dist/css/' . basename($file);
        wp_enqueue_style($handle, $file_url, array('elm-' . basename($file, '.css')));
    }

    // Enqueue scripts.
    foreach (glob($dist_path . 'js/*.js') as $file) {
        $handle = 'child-' . basename($file, '.js');
        $file_url = get_stylesheet_directory_uri() . '/dist/js/' . basename($file);
        wp_enqueue_script($handle, $file_url, array('jquery'), null, true);
    }
}
add_action('wp_enqueue_scripts', 'ec_enqueue_styles_and_scripts');
add_action('admin_enqueue_scripts', 'ec_enqueue_styles_and_scripts');

// Create generic function to include all files in specific folders
if (!function_exists('ec_include_folder')) {
    function ec_include_folder($folder)
    {
        // Make sure we have forwardslash before and after folder
        $folder = \str_starts_with($folder, '/') ? $folder : '/' . $folder;
        $folder = \str_ends_with($folder, '/') ? $folder : $folder . '/';

        // Get complete folder path
        $folder = get_stylesheet_directory() . $folder;

        // Return empty array if not found
        if (!is_dir($folder)) {
            return [];
        }
        $content = scandir($folder, 1);
        if (!$content || !\is_array($content)) {
            return [];
        }

        // Clear folders out to only get files
        $content = array_filter($content, function ($item) use ($folder) {
            return !is_dir($folder . $item);
        });

        foreach ($content as $file) {
            if (\str_ends_with($file, '.php')) {
                require_once $folder . $file;
            }
        }
    }
}
