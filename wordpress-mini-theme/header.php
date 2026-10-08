<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<script src="<?php echo esc_url( get_theme_file_uri( '/scripts/page-transition-boot.js' ) ); ?>"></script>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" href="<?php echo esc_url( get_theme_file_uri( '/assets/ico/ico-siemet.ico' ) ); ?>" sizes="any">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main-content"><?php esc_html_e( 'Saltar al contenido', 'siemet-mini' ); ?></a>
<header class="site-header">
	<a class="site-header__brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'SIEMET, inicio', 'siemet-mini' ); ?>" data-transition-title="Inicio">
		<img class="site-header__logo site-header__logo--white" src="<?php echo esc_url( get_theme_file_uri( '/assets/brand/logo-siemet-white.svg' ) ); ?>" alt="SIEMET">
		<img class="site-header__logo site-header__logo--blue" src="<?php echo esc_url( get_theme_file_uri( '/assets/brand/logo-siemet-blue.svg' ) ); ?>" alt="" aria-hidden="true">
	</a>
	<div class="site-header__menu">
		<nav class="site-nav" aria-label="<?php esc_attr_e( 'Navegación principal', 'siemet-mini' ); ?>">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" data-transition-title="Inicio"<?php echo is_front_page() ? ' aria-current="page"' : ''; ?>><?php esc_html_e( 'Inicio', 'siemet-mini' ); ?></a>
			<a href="<?php echo esc_url( get_post_type_archive_link( 'proyecto' ) ); ?>" data-transition-title="Proyectos"<?php echo ( is_post_type_archive( 'proyecto' ) || is_singular( 'proyecto' ) ) ? ' aria-current="page"' : ''; ?>><?php esc_html_e( 'Proyectos', 'siemet-mini' ); ?></a>
			<a href="#contacto"><?php esc_html_e( 'Contacto', 'siemet-mini' ); ?></a>
		</nav>
		<a class="button button--primary site-header__cta" href="https://wa.me/51942676263?text=Hola%2C%20quiero%20cotizar%20un%20proyecto%20con%20SIEMET." target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Cotiza un proyecto', 'siemet-mini' ); ?></a>
	</div>
	<details class="mobile-menu">
		<summary aria-label="<?php esc_attr_e( 'Abrir menú', 'siemet-mini' ); ?>">
			<svg class="lucide lucide-menu mobile-menu__open" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M4 6h16M4 18h16" /></svg>
			<svg class="lucide lucide-x mobile-menu__close" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
		</summary>
		<nav aria-label="<?php esc_attr_e( 'Navegación móvil', 'siemet-mini' ); ?>">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" data-transition-title="Inicio"><?php esc_html_e( 'Inicio', 'siemet-mini' ); ?></a>
			<a href="<?php echo esc_url( get_post_type_archive_link( 'proyecto' ) ); ?>" data-transition-title="Proyectos"><?php esc_html_e( 'Proyectos', 'siemet-mini' ); ?></a>
			<a href="#contacto"><?php esc_html_e( 'Contacto', 'siemet-mini' ); ?></a>
		</nav>
	</details>
</header>
