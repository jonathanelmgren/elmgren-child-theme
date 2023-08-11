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
