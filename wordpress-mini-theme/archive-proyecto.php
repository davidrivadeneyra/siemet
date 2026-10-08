<?php
get_header();

$tax_query     = array();
$archive_title = 'Proyectos';
if ( is_tax( 'sector_proyecto' ) ) {
	$term          = get_queried_object();
	$archive_title = $term->name;
	$tax_query     = array(
		array(
			'taxonomy' => 'sector_proyecto',
			'field'    => 'term_id',
			'terms'    => $term->term_id,
		),
	);
}

$featured_query = new WP_Query(
	array(
		'post_type'      => 'proyecto',
		'posts_per_page' => 1,
		'meta_key'       => '_siemet_featured',
		'meta_value'     => '1',
		'orderby'        => array( 'menu_order' => 'ASC', 'date' => 'DESC' ),
		'tax_query'      => $tax_query,
	)
);

if ( ! $featured_query->have_posts() ) {
	$featured_query = new WP_Query(
		array(
			'post_type'      => 'proyecto',
			'posts_per_page' => 1,
			'orderby'        => array( 'menu_order' => 'ASC', 'date' => 'DESC' ),
			'tax_query'      => $tax_query,
		)
	);
}

$featured_id = $featured_query->have_posts() ? $featured_query->posts[0]->ID : 0;
?>
<main id="main-content" class="projects-page">
	<section class="page-hero page-hero--service projects-hero" aria-labelledby="projects-title" data-header-theme="dark">
		<img class="page-hero__image" src="<?php siemet_mini_asset( '/assets/images/projects/hero.avif' ); ?>" alt="Estructura metálica de un proyecto ejecutado por SIEMET">
		<div class="page-hero__veil" aria-hidden="true"></div>
		<div class="page-hero__content">
			<span class="diagonal-lines diagonal-lines--white" aria-hidden="true"></span>
			<div class="page-hero__copy">
				<p class="page-hero__breadcrumb text-mono"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" data-transition-title="Inicio">Inicio</a> <span aria-hidden="true">&gt;</span> Proyectos</p>
				<div class="page-hero__main">
				<h1 class="heading heading--big" id="projects-title"><?php echo esc_html( $archive_title ); ?></h1>
					<div class="page-hero__description">
						<p class="text-body projects-hero__lead">Ingeniería y fabricación que se demuestran en campo.</p>
						<p class="text-body">Casos reales de torres, postes, protección atmosférica e infraestructura metálica ejecutados para sectores de alta exigencia.</p>
					</div>
					<a class="button button--white page-hero__cta" href="#contacto">Solicitar cotización</a>
				</div>
			</div>
		</div>
	</section>

	<section class="projects-showcase" aria-label="Proyectos realizados por SIEMET" data-header-theme="light">
		<?php if ( $featured_query->have_posts() ) : ?>
			<?php while ( $featured_query->have_posts() ) : $featured_query->the_post(); ?>
				<?php get_template_part( 'template-parts/project-card', null, array( 'featured' => true ) ); ?>
			<?php endwhile; wp_reset_postdata(); ?>
		<?php endif; ?>

		<?php
		$projects = new WP_Query(
			array(
				'post_type'      => 'proyecto',
				'posts_per_page' => -1,
				'post__not_in'   => $featured_id ? array( $featured_id ) : array(),
				'orderby'        => array( 'menu_order' => 'ASC', 'date' => 'DESC' ),
				'tax_query'      => $tax_query,
			)
		);
		?>
		<?php if ( $projects->have_posts() ) : ?>
			<div class="projects-grid">
				<?php while ( $projects->have_posts() ) : $projects->the_post(); ?>
					<?php get_template_part( 'template-parts/project-card' ); ?>
				<?php endwhile; ?>
			</div>
		<?php else : ?>
			<p class="text-body"><?php esc_html_e( 'Aún no hay proyectos publicados.', 'siemet-mini' ); ?></p>
		<?php endif; wp_reset_postdata(); ?>
	</section>
</main>
<?php get_footer(); ?>
