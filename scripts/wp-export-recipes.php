<?php
/**
 * Script d'export des recettes WordPress vers JSON pour Next.js
 *
 * USAGE:
 * 1. Uploadez ce fichier à la racine de votre WordPress
 * 2. Accédez à: https://votre-site.com/wp-export-recipes.php?secret=menucochon2024
 * 3. Téléchargez le fichier JSON généré
 * 4. Placez-le dans /src/data/recipes.json de votre projet Next.js
 */

// Sécurité - changez cette clé secrète
$SECRET_KEY = 'menucochon2024';

if (!isset($_GET['secret']) || $_GET['secret'] !== $SECRET_KEY) {
    http_response_code(403);
    die('Accès refusé. Utilisez ?secret=VOTRE_CLE');
}

// Charger WordPress
require_once('./wp-load.php');

// Configuration
$EXPORT_IMAGES = isset($_GET['images']) && $_GET['images'] === '1';
$OUTPUT_DIR = __DIR__ . '/wp-content/exports/';

if (!file_exists($OUTPUT_DIR)) {
    mkdir($OUTPUT_DIR, 0755, true);
}

/**
 * Obtenir toutes les recettes
 */
function get_all_recipes() {
    $args = array(
        'post_type' => 'recette',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC'
    );

    $query = new WP_Query($args);
    $recipes = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $recipes[] = export_recipe(get_the_ID());
        }
        wp_reset_postdata();
    }

    return $recipes;
}

/**
 * Exporter une recette
 */
function export_recipe($post_id) {
    $post = get_post($post_id);

    // Temps
    $prep_time = intval(get_field('prep_time', $post_id) ?: get_post_meta($post_id, 'prep_time', true));
    $cook_time = intval(get_field('cook_time', $post_id) ?: get_post_meta($post_id, 'cook_time', true));
    $rest_time = intval(get_field('rest_time', $post_id) ?: get_post_meta($post_id, 'rest_time', true));

    // Portions
    $servings = intval(get_field('servings', $post_id) ?: get_post_meta($post_id, 'servings', true));
    $servings_unit = get_field('servings_unit', $post_id) ?: get_post_meta($post_id, 'servings_unit', true);

    // Difficulté
    $difficulty = get_field('difficulty', $post_id) ?: get_post_meta($post_id, 'difficulty', true);
    if (!$difficulty) $difficulty = 'moyen';

    // Image principale
    $featured_image = '';
    if (has_post_thumbnail($post_id)) {
        $featured_image = get_the_post_thumbnail_url($post_id, 'full');
    }

    // Galerie d'images
    $gallery = get_field('recipe_gallery', $post_id) ?: array();
    $images = array();
    if (is_array($gallery)) {
        foreach ($gallery as $img) {
            if (is_array($img) && isset($img['url'])) {
                $images[] = $img['url'];
            } elseif (is_numeric($img)) {
                $images[] = wp_get_attachment_url($img);
            }
        }
    }

    // Ingrédients
    $ingredients = export_ingredients($post_id);

    // Instructions
    $instructions = export_instructions($post_id);

    // Nutrition
    $nutrition = export_nutrition($post_id);

    // Catégories
    $categories = array();
    $terms = get_the_terms($post_id, 'categorie_recette');
    if ($terms && !is_wp_error($terms)) {
        foreach ($terms as $term) {
            $categories[] = array(
                'id' => $term->term_id,
                'slug' => $term->slug,
                'name' => $term->name,
                'parent' => $term->parent
            );
        }
    }

    // Tags
    $tags = array();
    $tag_terms = get_the_terms($post_id, 'tag_recette');
    if ($tag_terms && !is_wp_error($tag_terms)) {
        foreach ($tag_terms as $tag) {
            $tags[] = $tag->name;
        }
    }

    // Cuisine
    $cuisine_terms = get_the_terms($post_id, 'cuisine');
    $cuisine = ($cuisine_terms && !is_wp_error($cuisine_terms)) ? $cuisine_terms[0]->name : null;

    // Likes
    $likes = intval(get_post_meta($post_id, 'sdr_likes_count', true));

    // Auteur
    $author = get_the_author_meta('display_name', $post->post_author);

    return array(
        'id' => $post_id,
        'slug' => $post->post_name,
        'title' => get_the_title($post_id),
        'excerpt' => get_the_excerpt($post_id),
        'content' => apply_filters('the_content', $post->post_content),
        'featuredImage' => $featured_image,
        'images' => $images,

        'prepTime' => $prep_time,
        'cookTime' => $cook_time,
        'restTime' => $rest_time ?: null,
        'totalTime' => $prep_time + $cook_time + $rest_time,

        'servings' => $servings ?: 4,
        'servingsUnit' => $servings_unit ?: 'portions',

        'difficulty' => $difficulty,

        'ingredients' => $ingredients,
        'instructions' => $instructions,
        'nutrition' => $nutrition,

        'categories' => $categories,
        'tags' => $tags,
        'cuisine' => $cuisine,

        'author' => $author,
        'publishedAt' => $post->post_date,
        'updatedAt' => $post->post_modified,

        'likes' => $likes,

        'seoTitle' => get_post_meta($post_id, '_yoast_wpseo_title', true) ?: null,
        'seoDescription' => get_post_meta($post_id, '_yoast_wpseo_metadesc', true) ?: null
    );
}

/**
 * Exporter les ingrédients
 */
function export_ingredients($post_id) {
    $groups = array();

    // Essayer ACF repeater
    $acf_ingredients = get_field('ingredients', $post_id);

    if ($acf_ingredients && is_array($acf_ingredients)) {
        // Format ACF avec groupes
        if (isset($acf_ingredients[0]['group_title'])) {
            foreach ($acf_ingredients as $group) {
                $items = array();
                if (isset($group['items']) && is_array($group['items'])) {
                    foreach ($group['items'] as $item) {
                        $items[] = array(
                            'quantity' => $item['quantity'] ?? null,
                            'unit' => $item['unit'] ?? null,
                            'name' => $item['name'] ?? $item['ingredient'] ?? '',
                            'note' => $item['note'] ?? null
                        );
                    }
                }
                $groups[] = array(
                    'title' => $group['group_title'] ?? null,
                    'items' => $items
                );
            }
        } else {
            // Format ACF simple
            $items = array();
            foreach ($acf_ingredients as $item) {
                if (is_array($item)) {
                    $items[] = array(
                        'quantity' => $item['quantity'] ?? null,
                        'unit' => $item['unit'] ?? null,
                        'name' => $item['name'] ?? $item['ingredient'] ?? '',
                        'note' => $item['note'] ?? null
                    );
                } else {
                    $items[] = array(
                        'quantity' => null,
                        'unit' => null,
                        'name' => $item,
                        'note' => null
                    );
                }
            }
            $groups[] = array(
                'title' => null,
                'items' => $items
            );
        }
    } else {
        // Fallback - meta simple
        $raw = get_post_meta($post_id, 'ingredients', true);
        if ($raw) {
            $lines = is_array($raw) ? $raw : explode("\n", $raw);
            $items = array();
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line) {
                    $items[] = array(
                        'quantity' => null,
                        'unit' => null,
                        'name' => $line,
                        'note' => null
                    );
                }
            }
            $groups[] = array(
                'title' => null,
                'items' => $items
            );
        }
    }

    return $groups;
}

/**
 * Exporter les instructions
 */
function export_instructions($post_id) {
    $steps = array();

    // Essayer ACF repeater
    $acf_instructions = get_field('instructions', $post_id);

    if ($acf_instructions && is_array($acf_instructions)) {
        $step_num = 1;
        foreach ($acf_instructions as $instruction) {
            $step_image = null;
            if (isset($instruction['image'])) {
                if (is_array($instruction['image']) && isset($instruction['image']['url'])) {
                    $step_image = $instruction['image']['url'];
                } elseif (is_numeric($instruction['image'])) {
                    $step_image = wp_get_attachment_url($instruction['image']);
                }
            }

            $steps[] = array(
                'step' => $step_num,
                'title' => $instruction['title'] ?? null,
                'content' => $instruction['content'] ?? $instruction['instruction'] ?? $instruction['step'] ?? '',
                'image' => $step_image,
                'tip' => $instruction['tip'] ?? $instruction['conseil'] ?? null
            );
            $step_num++;
        }
    } else {
        // Fallback - meta simple
        $raw = get_post_meta($post_id, 'instructions', true);
        if ($raw) {
            $lines = is_array($raw) ? $raw : explode("\n", $raw);
            $step_num = 1;
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line) {
                    $steps[] = array(
                        'step' => $step_num,
                        'title' => null,
                        'content' => $line,
                        'image' => null,
                        'tip' => null
                    );
                    $step_num++;
                }
            }
        }
    }

    return $steps;
}

/**
 * Exporter les informations nutritionnelles
 */
function export_nutrition($post_id) {
    $nutrition = array();

    $fields = array(
        'calories' => 'calories',
        'protein' => 'protein',
        'carbs' => 'carbs',
        'fat' => 'fat',
        'fiber' => 'fiber',
        'sugar' => 'sugar',
        'sodium' => 'sodium'
    );

    foreach ($fields as $key => $field) {
        $value = get_field($field, $post_id) ?: get_post_meta($post_id, $field, true);
        if ($value) {
            $nutrition[$key] = floatval($value);
        }
    }

    return empty($nutrition) ? null : $nutrition;
}

/**
 * Obtenir toutes les catégories
 */
function get_all_categories() {
    $terms = get_terms(array(
        'taxonomy' => 'categorie_recette',
        'hide_empty' => false
    ));

    $categories = array();
    if ($terms && !is_wp_error($terms)) {
        foreach ($terms as $term) {
            $categories[] = array(
                'id' => $term->term_id,
                'slug' => $term->slug,
                'name' => $term->name,
                'description' => $term->description,
                'parent' => $term->parent,
                'count' => $term->count,
                'image' => get_field('category_image', 'categorie_recette_' . $term->term_id) ?: null
            );
        }
    }

    return $categories;
}

// Exécution
header('Content-Type: application/json; charset=utf-8');

$export = array(
    'exportDate' => date('Y-m-d H:i:s'),
    'siteUrl' => get_site_url(),
    'siteName' => get_bloginfo('name'),
    'recipes' => get_all_recipes(),
    'categories' => get_all_categories()
);

// Sauvegarder le fichier
$filename = 'recipes-export-' . date('Y-m-d-His') . '.json';
file_put_contents($OUTPUT_DIR . $filename, json_encode($export, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Option de téléchargement direct
if (isset($_GET['download'])) {
    header('Content-Disposition: attachment; filename="' . $filename . '"');
}

echo json_encode($export, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
