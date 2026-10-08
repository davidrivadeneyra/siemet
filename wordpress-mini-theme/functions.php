<?php
/**
 * Funciones del tema SIEMET Mini.
 *
 * @package Siemet_Mini
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SIEMET_MINI_VERSION', '0.1.1' );

function siemet_mini_asset( $path ) {
	echo esc_url( get_theme_file_uri( $path ) );
}

function siemet_mini_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 72,
			'width'       => 240,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	register_nav_menus(
		array(
			'primary' => __( 'Navegación principal', 'siemet-mini' ),
			'footer'  => __( 'Navegación del pie', 'siemet-mini' ),
		)
	);
}
add_action( 'after_setup_theme', 'siemet_mini_setup' );

function siemet_mini_assets() {
	$theme_uri = get_template_directory_uri();

	wp_enqueue_style( 'siemet-main', $theme_uri . '/styles/main.css', array(), SIEMET_MINI_VERSION );
	wp_enqueue_style( 'siemet-home', $theme_uri . '/styles/pages/home.css', array( 'siemet-main' ), SIEMET_MINI_VERSION );

	if ( is_post_type_archive( 'proyecto' ) || is_tax( 'sector_proyecto' ) ) {
		wp_enqueue_style( 'siemet-projects', $theme_uri . '/styles/pages/projects.css', array( 'siemet-home' ), SIEMET_MINI_VERSION );
	}

	if ( is_singular( 'proyecto' ) ) {
		wp_enqueue_style( 'siemet-project-detail', $theme_uri . '/styles/pages/project-detail.css', array( 'siemet-home' ), SIEMET_MINI_VERSION );
	}

	wp_enqueue_style( 'siemet-lenis', 'https://cdn.jsdelivr.net/npm/lenis@1.2.3/dist/lenis.css', array(), '1.2.3' );
	wp_enqueue_script( 'siemet-gsap', 'https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js', array(), '3.15.0', true );
	wp_enqueue_script( 'siemet-scroll-trigger', 'https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js', array( 'siemet-gsap' ), '3.15.0', true );
	wp_enqueue_script( 'siemet-lenis-js', 'https://cdn.jsdelivr.net/npm/lenis@1.2.3/dist/lenis.min.js', array(), '1.2.3', true );
	wp_enqueue_script( 'siemet-theme', $theme_uri . '/scripts/theme.js', array( 'siemet-lenis-js', 'siemet-scroll-trigger' ), SIEMET_MINI_VERSION, true );

	wp_localize_script(
		'siemet-theme',
		'siemetTheme',
		array(
			'assetUrl'    => $theme_uri,
			'homeUrl'     => home_url( '/' ),
			'projectsUrl' => get_post_type_archive_link( 'proyecto' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'siemet_mini_assets' );

function siemet_mini_module_scripts( $tag, $handle, $src ) {
	if ( 'siemet-theme' !== $handle ) {
		return $tag;
	}

	return sprintf( '<script type="module" src="%s" id="%s-js"></script>', esc_url( $src ), esc_attr( $handle ) );
}
add_filter( 'script_loader_tag', 'siemet_mini_module_scripts', 10, 3 );

function siemet_mini_register_content() {
	register_post_type(
		'proyecto',
		array(
			'labels'       => array(
				'name'          => __( 'Proyectos', 'siemet-mini' ),
				'singular_name' => __( 'Proyecto', 'siemet-mini' ),
				'add_new_item'  => __( 'Añadir proyecto', 'siemet-mini' ),
				'edit_item'     => __( 'Editar proyecto', 'siemet-mini' ),
			),
			'public'       => true,
			'has_archive'  => 'proyectos',
			'rewrite'      => array( 'slug' => 'proyectos', 'with_front' => false ),
			'menu_icon'    => 'dashicons-portfolio',
			'show_in_rest' => true,
			'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
		)
	);

	register_taxonomy(
		'sector_proyecto',
		array( 'proyecto' ),
		array(
			'labels'       => array(
				'name'          => __( 'Sectores', 'siemet-mini' ),
				'singular_name' => __( 'Sector', 'siemet-mini' ),
			),
			'public'       => true,
			'show_in_rest' => true,
			'hierarchical' => true,
			'rewrite'      => array( 'slug' => 'sector-proyecto' ),
		)
	);

	$meta_fields = array(
		'_siemet_client'        => 'sanitize_text_field',
		'_siemet_scope'         => 'sanitize_text_field',
		'_siemet_location'      => 'sanitize_text_field',
		'_siemet_solution'      => 'sanitize_text_field',
		'_siemet_result'        => 'sanitize_textarea_field',
		'_siemet_cta_label'     => 'sanitize_text_field',
		'_siemet_cta_url'       => 'esc_url_raw',
		'_siemet_gallery_urls'  => 'siemet_mini_sanitize_gallery_urls',
		'_siemet_featured'      => 'rest_sanitize_boolean',
		'_siemet_metric_one'    => 'sanitize_text_field',
		'_siemet_metric_two'    => 'sanitize_text_field',
		'_siemet_metric_three'  => 'sanitize_text_field',
	);

	foreach ( $meta_fields as $key => $sanitize_callback ) {
		register_post_meta(
			'proyecto',
			$key,
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => '_siemet_featured' === $key ? 'boolean' : 'string',
				'sanitize_callback' => $sanitize_callback,
				'auth_callback'     => static function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}
add_action( 'init', 'siemet_mini_register_content' );

function siemet_mini_sanitize_gallery_urls( $value ) {
	$urls = preg_split( '/\R/', (string) $value );
	$urls = array_filter( array_map( 'esc_url_raw', $urls ) );
	return implode( "\n", $urls );
}

function siemet_mini_add_project_metabox() {
	add_meta_box(
		'siemet-project-details',
		__( 'Datos del proyecto', 'siemet-mini' ),
		'siemet_mini_render_project_metabox',
		'proyecto',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'siemet_mini_add_project_metabox' );

function siemet_mini_render_project_metabox( $post ) {
	wp_nonce_field( 'siemet_project_details', 'siemet_project_nonce' );
	$fields = array(
		'_siemet_client'       => __( 'Cliente', 'siemet-mini' ),
		'_siemet_scope'        => __( 'Alcance', 'siemet-mini' ),
		'_siemet_location'     => __( 'Ubicación', 'siemet-mini' ),
		'_siemet_solution'     => __( 'Solución', 'siemet-mini' ),
		'_siemet_cta_label'    => __( 'Texto del botón', 'siemet-mini' ),
		'_siemet_cta_url'      => __( 'URL del botón', 'siemet-mini' ),
		'_siemet_metric_one'   => __( 'Métrica 1', 'siemet-mini' ),
		'_siemet_metric_two'   => __( 'Métrica 2', 'siemet-mini' ),
		'_siemet_metric_three' => __( 'Métrica 3', 'siemet-mini' ),
	);

	echo '<table class="form-table"><tbody>';
	foreach ( $fields as $key => $label ) {
		printf(
			'<tr><th><label for="%1$s">%2$s</label></th><td><input class="widefat" type="text" id="%1$s" name="%1$s" value="%3$s"></td></tr>',
			esc_attr( $key ),
			esc_html( $label ),
			esc_attr( get_post_meta( $post->ID, $key, true ) )
		);
	}
	printf(
		'<tr><th><label for="_siemet_result">%1$s</label></th><td><textarea class="widefat" rows="3" id="_siemet_result" name="_siemet_result">%2$s</textarea></td></tr>',
		esc_html__( 'Resultado', 'siemet-mini' ),
		esc_textarea( get_post_meta( $post->ID, '_siemet_result', true ) )
	);
	printf(
		'<tr><th><label for="_siemet_gallery_urls">%1$s</label></th><td><textarea class="widefat" rows="5" id="_siemet_gallery_urls" name="_siemet_gallery_urls">%2$s</textarea><p class="description">%3$s</p></td></tr>',
		esc_html__( 'Galería', 'siemet-mini' ),
		esc_textarea( get_post_meta( $post->ID, '_siemet_gallery_urls', true ) ),
		esc_html__( 'Una URL de imagen por línea. Esta interfaz se reemplazará por un selector multimedia en la versión completa.', 'siemet-mini' )
	);
	printf(
		'<tr><th>%1$s</th><td><label><input type="checkbox" name="_siemet_featured" value="1" %2$s> %3$s</label></td></tr>',
		esc_html__( 'Proyecto destacado', 'siemet-mini' ),
		checked( (bool) get_post_meta( $post->ID, '_siemet_featured', true ), true, false ),
		esc_html__( 'Mostrar como destacado en el archivo.', 'siemet-mini' )
	);
	echo '</tbody></table>';
}

function siemet_mini_save_project_meta( $post_id ) {
	if ( ! isset( $_POST['siemet_project_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['siemet_project_nonce'] ) ), 'siemet_project_details' ) ) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$text_fields = array(
		'_siemet_client',
		'_siemet_scope',
		'_siemet_location',
		'_siemet_solution',
		'_siemet_cta_label',
		'_siemet_metric_one',
		'_siemet_metric_two',
		'_siemet_metric_three',
	);

	foreach ( $text_fields as $key ) {
		if ( isset( $_POST[ $key ] ) ) {
			update_post_meta( $post_id, $key, sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) );
		}
	}

	if ( isset( $_POST['_siemet_result'] ) ) {
		update_post_meta( $post_id, '_siemet_result', sanitize_textarea_field( wp_unslash( $_POST['_siemet_result'] ) ) );
	}
	if ( isset( $_POST['_siemet_cta_url'] ) ) {
		update_post_meta( $post_id, '_siemet_cta_url', esc_url_raw( wp_unslash( $_POST['_siemet_cta_url'] ) ) );
	}
	if ( isset( $_POST['_siemet_gallery_urls'] ) ) {
		update_post_meta( $post_id, '_siemet_gallery_urls', siemet_mini_sanitize_gallery_urls( wp_unslash( $_POST['_siemet_gallery_urls'] ) ) );
	}

	update_post_meta( $post_id, '_siemet_featured', isset( $_POST['_siemet_featured'] ) );
}
add_action( 'save_post_proyecto', 'siemet_mini_save_project_meta' );

function siemet_mini_project_meta( $key, $post_id = null ) {
	return get_post_meta( $post_id ?: get_the_ID(), '_siemet_' . $key, true );
}

function siemet_mini_project_sector( $post_id = null ) {
	$terms = get_the_terms( $post_id ?: get_the_ID(), 'sector_proyecto' );
	return $terms && ! is_wp_error( $terms ) ? $terms[0]->name : __( 'Proyecto', 'siemet-mini' );
}

function siemet_mini_fallback_project_image( $slug = '' ) {
	$map = array(
		'torres-ventadas-y-autosoportadas'              => 'agua-saneamiento.webp',
		'torre-movil'                                   => 'torre-movil.webp',
		'torres-ventadas-120-metros'                    => 'torres-ventadas-120m.webp',
		'proteccion-contra-rayos-operacion-minera'      => 'proteccion-rayos-mineria.webp',
		'postes-poligonales-sistemas-proteccion'        => 'postes-poligonales-proteccion.webp',
		'postes-metalicos-sistemas-pararrayos'          => 'postes-metalicos-pararrayos.webp',
	);
	$file = $map[ $slug ] ?? 'torres-ventadas-120m.webp';
	return get_theme_file_uri( '/assets/images/projects/cards/' . $file );
}

function siemet_mini_project_image_url( $post_id = null, $size = 'large' ) {
	$post_id = $post_id ?: get_the_ID();
	$url     = get_the_post_thumbnail_url( $post_id, $size );
	return $url ?: siemet_mini_fallback_project_image( get_post_field( 'post_name', $post_id ) );
}

function siemet_mini_seed_demo_content() {
	if ( ! post_type_exists( 'proyecto' ) ) {
		siemet_mini_register_content();
	}

	$projects = array(
		array(
			'slug'     => 'torres-ventadas-y-autosoportadas',
			'title'    => 'Torres ventadas y autosoportadas',
			'sector'   => 'Agua y saneamiento',
			'excerpt'  => 'Torres metálicas desarrolladas para infraestructura de agua y saneamiento.',
			'content'  => 'Diseño, fabricación e instalación de torres ventadas y autosoportadas para instalaciones de SEDAPAL, integrando ingeniería estructural, producción y montaje en campo.',
			'client'   => 'SEDAPAL',
			'scope'    => 'Diseño, fabricación e instalación',
			'solution' => 'Torres metálicas',
			'result'   => 'Infraestructura metálica estable y adaptada a los requerimientos operativos del proyecto.',
			'gallery'  => array( 'torre-ventada.webp', 'torre-autosoportada-cuadrada.webp' ),
		),
		array(
			'slug'     => 'torre-movil',
			'title'    => 'Torre móvil',
			'sector'   => 'Infraestructura portuaria',
			'excerpt'  => 'Torre móvil instalada en el Terminal Portuario de Paracas.',
			'content'  => 'Diseño, fabricación e instalación de una torre móvil para atender requerimientos operativos dentro del Terminal Portuario de Paracas, priorizando movilidad, estabilidad, facilidad de despliegue y funcionamiento en campo.',
			'client'   => 'Terminal Portuario de Paracas',
			'scope'    => 'Diseño, fabricación e instalación',
			'location' => 'Terminal Portuario de Paracas',
			'solution' => 'Torre móvil',
			'result'   => 'Una solución adaptable para operaciones que requieren infraestructura temporal o reubicable.',
			'gallery'  => array( 'torre-movil-2.webp', 'torre-movil-3.webp', 'torre-movil-4.webp' ),
		),
		array(
			'slug'       => 'torres-ventadas-120-metros',
			'title'      => 'Torres ventadas de 120 metros',
			'sector'     => 'Energías renovables',
			'excerpt'    => '15 torres de 120 metros de altura.',
			'content'    => 'Diseño y fabricación de quince torres ventadas de 120 metros de altura para aplicaciones vinculadas al sector de energías renovables. El proyecto exigió coordinación técnica, control dimensional y capacidad productiva para desarrollar estructuras de gran altura bajo requerimientos específicos.',
			'client'     => 'Barlovento Applus',
			'scope'      => 'Diseño y fabricación',
			'solution'   => 'Torres ventadas',
			'result'     => 'Estructuras de gran altura resueltas con precisión de fabricación y control dimensional.',
			'gallery'    => array( 'torre-120-metros-2.webp', 'torre-120-metros-3.webp' ),
			'featured'   => true,
			'metrics'    => array( '15 torres', '120 m altura', 'DF diseño + fab.' ),
		),
		array(
			'slug'     => 'proteccion-contra-rayos-operacion-minera',
			'title'    => 'Sistema de protección contra rayos para operación minera',
			'sector'   => 'Minería',
			'excerpt'  => 'Sistema de protección contra rayos instalado para una operación minera de Antamina.',
			'content'  => 'Instalación de un sistema de protección contra descargas atmosféricas orientado a reducir riesgos para personas, equipos e infraestructura dentro de una operación minera.',
			'client'   => 'Antamina',
			'scope'    => 'Instalación',
			'solution' => 'Protección atmosférica',
			'result'   => 'Protección técnica para instalaciones donde la continuidad operativa es prioritaria.',
			'gallery'  => array( 'sistemas-proteccion-contra-el-rayo-2.webp', 'sistemas-proteccion-contra-el-rayo-3.webp' ),
		),
		array(
			'slug'     => 'postes-poligonales-sistemas-proteccion',
			'title'    => 'Postes poligonales para sistemas de protección',
			'sector'   => 'Iluminación e infraestructura',
			'excerpt'  => 'Postes poligonales para sistemas de iluminación y protección eléctrica.',
			'content'  => 'Diseño y fabricación de postes metálicos poligonales para sistemas de iluminación y protección eléctrica desarrollados según normativas estructurales.',
			'client'   => 'SERTEPEC',
			'scope'    => 'Diseño y fabricación',
			'solution' => 'Postes poligonales',
			'result'   => 'Postes fabricados a medida para brindar resistencia, orden visual y facilidad de instalación.',
			'gallery'  => array( 'postes-poligonales-pluspetrol-2.webp' ),
		),
		array(
			'slug'     => 'postes-metalicos-sistemas-pararrayos',
			'title'    => 'Postes metálicos para sistemas de pararrayos',
			'sector'   => 'Minería',
			'excerpt'  => 'Postes diseñados y fabricados para la operación minera Las Bambas.',
			'content'  => 'Fabricación de postes metálicos para la implementación de sistemas de protección contra descargas atmosféricas en una operación minera de alta exigencia.',
			'client'   => 'Minera Las Bambas',
			'scope'    => 'Diseño y fabricación',
			'solution' => 'Postes para pararrayos',
			'result'   => 'Estructuras fabricadas para sostener sistemas de protección en entornos operativos críticos.',
			'gallery'  => array( 'postes-para-mineria-2.webp' ),
		),
	);

	foreach ( $projects as $order => $project ) {
		if ( get_page_by_path( $project['slug'], OBJECT, 'proyecto' ) ) {
			continue;
		}

		$post_id = wp_insert_post(
			array(
				'post_type'    => 'proyecto',
				'post_status'  => 'publish',
				'post_title'   => $project['title'],
				'post_name'    => $project['slug'],
				'post_excerpt' => $project['excerpt'],
				'post_content' => $project['content'],
				'menu_order'   => $order,
			)
		);

		if ( is_wp_error( $post_id ) ) {
			continue;
		}

		wp_set_object_terms( $post_id, $project['sector'], 'sector_proyecto' );
		update_post_meta( $post_id, '_siemet_client', $project['client'] );
		update_post_meta( $post_id, '_siemet_scope', $project['scope'] );
		update_post_meta( $post_id, '_siemet_location', $project['location'] ?? '—' );
		update_post_meta( $post_id, '_siemet_solution', $project['solution'] );
		update_post_meta( $post_id, '_siemet_result', $project['result'] );
		update_post_meta( $post_id, '_siemet_cta_label', 'Solicitar una solución similar' );
		update_post_meta( $post_id, '_siemet_cta_url', '#contacto' );
		update_post_meta( $post_id, '_siemet_featured', ! empty( $project['featured'] ) );

		$gallery = array_map(
			static fn( $file ) => get_theme_file_uri( '/assets/images/projects/detail/' . $file ),
			$project['gallery']
		);
		update_post_meta( $post_id, '_siemet_gallery_urls', implode( "\n", $gallery ) );

		foreach ( $project['metrics'] ?? array() as $index => $metric ) {
			update_post_meta( $post_id, '_siemet_metric_' . array( 'one', 'two', 'three' )[ $index ], $metric );
		}
	}

	if ( ! (int) get_option( 'page_on_front' ) ) {
		$home = get_page_by_path( 'inicio' );
		if ( ! $home ) {
			$home_id = wp_insert_post(
				array(
					'post_type'   => 'page',
					'post_status' => 'publish',
					'post_title'  => 'Inicio',
					'post_name'   => 'inicio',
				)
			);
		} else {
			$home_id = $home->ID;
		}

		if ( ! is_wp_error( $home_id ) ) {
			update_option( 'show_on_front', 'page' );
			update_option( 'page_on_front', $home_id );
		}
	}

	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'siemet_mini_seed_demo_content' );
