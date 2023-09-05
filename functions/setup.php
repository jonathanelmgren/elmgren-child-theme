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

// Register public styles and scripts
function ec_enqueue_styles_and_scripts()
{
    $dist_path = get_stylesheet_directory_uri() . '/dist/';
    $css_path = $dist_path . 'css/';
    $js_path = $dist_path . 'js/';

    // Scripts
    wp_enqueue_script('jquery');
    wp_enqueue_script('elm-child-main-js', $js_path . 'main.js');

    // Styles
    wp_enqueue_style('elm-child-main-css', $css_path . 'main.css', ['elm-main-css']);
}
add_action('wp_enqueue_scripts', 'ec_enqueue_styles_and_scripts');

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

        // Clear folders out to only get folders
        $content = scandir($folder, 1);
        $content = array_filter($content, function ($item) use ($folder) {
            return is_dir($folder . $item) && !in_array($item, ['.', '..']);
        });

        foreach ($content as $subfolder) {
            ec_include_folder(trim(str_replace(get_stylesheet_directory(), '', $folder), '/') . '/' . $subfolder);
        }
    }
}
