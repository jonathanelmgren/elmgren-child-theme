<?php

class Theme_Child_Updater
{
    private $user;
    private $repo;
    private $theme;
    private $project_name;
    private $github_auth_args;

    public function __construct()
    {
        $this->project_name = $_ENV['GITHUB_REPO'] ?? $_ENV['COMPOSE_PROJECT_NAME'] ?? null;
        $this->user = 'jonathanelmgren';
        $this->repo = $this->project_name;
        $this->theme = wp_get_theme($this->project_name);
        $this->github_auth_args = array(
            'headers' => array(
                'Authorization' => 'token ' . $_ENV['GITHUB_TOKEN'],
            ),
        );

        if ($this->theme->exists()) {
            add_filter('pre_set_site_transient_update_themes', array($this, 'check_update'));
        }
    }

    public function check_update($transient)
    {
        if (empty($transient->checked)) {
            return $transient;
        }

        $release = $this->get_appropriate_release();
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

        if ($this->is_beta()) {
            foreach ($releases as $release) {
                if (strpos($release->tag_name, 'beta') !== false) {
                    return $release;
                }
            }
        }

        return $releases[0];
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
                return $asset->browser_download_url;
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
}

new Theme_Child_Updater();
