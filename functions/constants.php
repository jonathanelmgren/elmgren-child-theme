<?php

function ec_define($name, $value)
{
    if (!defined($name)) {
        define($name, $value);
    }
}

function ec_define_env($name, $value = null)
{
    ec_define($name, (isset($_ENV[$name]) ? $_ENV[$name] : getenv($name)) ?: $value);
}

// If github token is not defined in wp-config, see if it exists in a .env file
ec_define_env('GITHUB_TOKEN');
ec_define_env('GITHUB_REPO');
ec_define_env('COMPOSE_PROJECT_NAME', wp_get_theme()->get_stylesheet());

// === START: Webpack Generated Block ===
if (!defined('TAILWIND_COLORS')) {
    define('TAILWIND_COLORS', json_decode('{"primary":{"50":"#25066C","100":"#F9F7FF","200":"#DED0FC","300":"#C2A9FA","400":"#A783F8","500":"#8B5CF6","600":"#6527F3","700":"#4A0CD6","800":"#3709A1","900":"#25066C","950":"#1C0451","DEFAULT":"#8B5CF6"},"secondary":{"50":"#FCE4BB","100":"#FBDCA8","200":"#FACD81","300":"#F8BD59","400":"#F7AE32","500":"#F59E0B","600":"#C07C08","700":"#8A5906","800":"#543603","900":"#1E1401","950":"#030200","DEFAULT":"#F59E0B"}}', true));
}
// === END: Webpack Generated Block ===
