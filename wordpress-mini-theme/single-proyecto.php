<?php
get_header();

while ( have_posts() ) :
	the_post();
	$gallery = array_filter( preg_split( '/\R/', (string) siemet_mini_project_meta( 'gallery_urls' ) ) );
	$client  = siemet_mini_project_meta( 'client' );
	$scope   = siemet_mini_project_meta( 'scope' );
	$place   = siemet_mini_project_meta( 'location' );
	$solution = siemet_mini_project_meta( 'solution' );
	$result   = siemet_mini_project_meta( 'result' );
	$cta_url  = siemet_mini_project_meta( 'cta_url' ) ?: '#contacto';
	$cta_text = siemet_mini_project_meta( 'cta_label' ) ?: __( 'Solicitar una solución similar', 'siemet-mini' );
	?>
	<main id="main-content" class="project-detail-page">
		<section class="page-hero page-hero--service project-detail-hero" aria-labelledby="project-title" data-header-theme="dark">
			<img class="page-hero__image" src="<?php echo esc_url( siemet_mini_project_image_url( get_the_ID(), 'full' ) ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>">
			<div class="page-hero__veil" aria-hidden="true"></div>
			<div class="page-hero__content">
				<span class="diagonal-lines diagonal-lines--white" aria-hidden="true"></span>
				<div class="page-hero__copy">
					<p class="page-hero__breadcrumb text-mono"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" data-transition-title="Inicio">Inicio</a> <span aria-hidden="true">&gt;</span> <a href="<?php echo esc_url( get_post_type_archive_link( 'proyecto' ) ); ?>" data-transition-title="Proyectos">Proyectos</a> <span aria-hidden="true">&gt;</span> <?php the_title(); ?></p>
					<div class="project-detail-hero__main">
						<p class="project-detail-hero__sector"><?php echo esc_html( 'Sector: ' . siemet_mini_project_sector() ); ?></p>
						<h1 class="heading heading--big" id="project-title"><?php the_title(); ?></h1>
						<?php if ( has_excerpt() ) : ?><p class="project-detail-hero__description"><?php echo esc_html( get_the_excerpt() ); ?></p><?php endif; ?>
					</div>
				</div>
			</div>
			<dl class="project-detail-hero__facts">
				<div class="project-detail-hero__fact"><dt>Solución</dt><dd><?php echo esc_html( $solution ?: '—' ); ?></dd></div>
				<div class="project-detail-hero__fact"><dt>Cliente</dt><dd><?php echo esc_html( $client ?: '—' ); ?></dd></div>
				<div class="project-detail-hero__fact"><dt>Alcance</dt><dd><?php echo esc_html( $scope ?: '—' ); ?></dd></div>
				<div class="project-detail-hero__fact"><dt>Ubicación</dt><dd><?php echo esc_html( $place ?: '—' ); ?></dd></div>
			</dl>
		</section>

		<section class="project-detail-content" aria-labelledby="project-development-title" data-header-theme="light">
			<div class="project-detail-content__heading">
				<p class="project-detail-section-label">El proyecto</p>
				<div class="project-detail-content__copy">
					<h2 class="heading heading--regular" id="project-development-title">Desarrollo y alcance de la solución</h2>
					<div class="text-body"><?php the_content(); ?></div>
				</div>
			</div>
			<?php if ( $gallery ) : ?>
				<div class="project-detail-gallery<?php echo count( $gallery ) >= 3 ? ' project-detail-gallery--three' : ''; ?>">
					<?php foreach ( $gallery as $index => $image_url ) : ?>
						<img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( get_the_title() . ' — imagen ' . ( $index + 1 ) ); ?>" loading="lazy">
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
			<div class="project-outcome">
				<h2 class="heading heading--regular">Una solución orientada a resultados</h2>
				<?php if ( $result ) : ?><p class="text-body"><?php echo esc_html( $result ); ?></p><?php endif; ?>
				<a class="button button--white" href="<?php echo esc_url( $cta_url ); ?>"><?php echo esc_html( $cta_text ); ?></a>
			</div>
		</section>
	</main>
	<?php
endwhile;

get_footer();
