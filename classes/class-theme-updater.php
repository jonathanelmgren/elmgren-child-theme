<?php

class Theme_Child_Updater
{
    private $user;
    private $repo;
    private $theme;
    private $project_name;
    private $github_auth_args;
    private $github_token;
    
    public function __construct()
    {
        $this->github_token = GITHUB_TOKEN ?? null;
        $this->project_name = GITHUB_REPO ?? COMPOSE_PROJECT_NAME ?? null;

        $this->user = 'jonathanelmgren';
        $this->repo = $this->project_name;
        $this->theme = wp_get_theme($this->project_name);

        $this->github_auth_args = array(
            'headers' => array(
                'Authorization' => 'token ' . $this->github_token,
            ),
        );

        if ($this->theme->exists()) {
            add_filter('http_request_args', array($this, 'add_github_auth_headers'), 10, 2);
            add_filter('pre_set_site_transient_update_themes', array($this, 'check_update'));
        }
    }

    public function check_update($transient)
    {

        if (empty($transient->checked)) {
            return $transient;
        }

        $release = $this->fetchLatestRelease();
        if (!$release) {
            return $transient;
        }

        if (version_compare($this->theme->version, $release->tag_name, '<')) {
            $asset = $this->get_asset_download_url($release->assets_url);
            if ($asset !== false) {
                $transient->response[$this->theme->stylesheet] = array(
                    'theme'       => $this->theme->get('Name'),
                    'new_version' => $release->tag_name,
                    'url'         => $release->html_url,
                    'package'     => $asset,
                );
            }
        }

        return $transient;
    }

    private function get_appropriate_release()
    {
        $url = "https://api.github.com/repos/{$this->user}/{$this->repo}/releases";

        $response = wp_remote_get($url, $this->github_auth_args);
        $response_body = wp_remote_retrieve_body($response);

        if (is_wp_error($response) || empty($response_body)) {
            return false;
        }

        $releases = json_decode($response_body);

        $latestRelease = null;

        for ($i = 0; $i < min(10, count($releases)); $i++) {
            $release = $releases[$i];

            // Check if it's a beta release
            $isBeta = strpos($release->tag_name, 'beta') !== false;

            // If it's not beta or if beta is allowed
            if (!$isBeta || ($isBeta && $this->is_beta())) {
                // Compare version and update the latest release if the new one is greater
                if ($latestRelease === null || version_compare($release->tag_name, $latestRelease->tag_name, '>')) {
                    $latestRelease = $release;
                }
            }
        }

        return $latestRelease;
    }

    private function get_asset_download_url($url)
    {
        $response = wp_remote_get($url, $this->github_auth_args);
        $response_body = wp_remote_retrieve_body($response);

        if (is_wp_error($response) || empty($response_body)) {
            return false;
        }

        $assets = json_decode($response_body);
        foreach ($assets as $asset) {
            if ($asset->name === $this->project_name . '.zip') {
                return $asset->url;
            }
        }

        return false;
    }

    private function is_beta()
    {
        $options = get_field('beta', 'options');
        if (is_array($options) && array_key_exists('allow_beta_child', $options)) {
            return $options['allow_beta_child'];
        }
        return false;
    }
    public function add_github_auth_headers($args, $url)
    {
        if (preg_match("#^https://api\.github\.com/repos/{$this->user}/{$this->repo}/releases/assets/\d+$#", $url)) {
            $download_args = $this->github_auth_args;
            $download_args['headers']['Accept'] = 'application/octet-stream';
            $args = wp_parse_args($download_args, $args);
        }

        return $args;
    }
}

new Theme_Child_Updater();
