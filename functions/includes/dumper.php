<?php

if (!function_exists('dump')) {
    function dump(mixed $var, mixed ...$moreVars): mixed
    {
        Symfony\Component\VarDumper\VarDumper::dump($var);

        foreach ($moreVars as $v) {
            Symfony\Component\VarDumper\VarDumper::dump($v);
        }

        if (1 < func_num_args()) {
            return func_get_args();
        }

        return $var;
    }
}

if (!function_exists('dd')) {
    function dd(...$vars): void
    {
        if (!in_array(\PHP_SAPI, ['cli', 'phpdbg'], true) && !headers_sent()) {
            header('HTTP/1.1 500 Internal Server Error');
        }

        foreach ($vars as $v) {
            Symfony\Component\VarDumper\VarDumper::dump($v);
        }

        exit(1);
    }
}
