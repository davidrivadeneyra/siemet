<?php
$featured = ! empty( $args['featured'] );
$image    = siemet_mini_project_image_url( get_the_ID(), $featured ? 'full' : 'large' );
$client   = siemet_mini_project_meta( 'client' );
$scope    = siemet_mini_project_meta( 'scope' );
?>
<?php if ( $featured ) : ?>
	<article class="featured-project" aria-labelledby="featured-project-<?php the_ID(); ?>">
		<div class="featured-project__media">
			<img src="<?php echo esc_url( $image ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>">
		</div>
		<div class="featured-project__content">
			<div class="featured-project__body">
				<div class="project-label project-label--featured"><span aria-hidden="true"></span><?php esc_html_e( 'Proyecto destacado', 'siemet-mini' ); ?></div>
				<div class="featured-project__copy">
					<h2 class="heading heading--regular" id="featured-project-<?php the_ID(); ?>"><?php the_title(); ?></h2>
					<div class="project-meta">
						<?php if ( $client ) : ?><p><?php echo esc_html( 'Cliente: ' . $client ); ?></p><?php endif; ?>
						<?php if ( $scope ) : ?><p><?php echo esc_html( 'Alcance: ' . $scope ); ?></p><?php endif; ?>
					</div>
				</div>
				<div class="featured-project__metrics" aria-label="<?php esc_attr_e( 'Métricas del proyecto', 'siemet-mini' ); ?>">
					<?php foreach ( array( 'metric_one', 'metric_two', 'metric_three' ) as $metric_key ) : ?>
						<?php $metric = siemet_mini_project_meta( $metric_key ); ?>
						<?php if ( $metric ) : ?><span><?php echo esc_html( $metric ); ?></span><?php endif; ?>
					<?php endforeach; ?>
				</div>
			</div>
			<a class="project-link" href="<?php the_permalink(); ?>" data-transition-title="<?php echo esc_attr( get_the_title() ); ?>"><?php esc_html_e( 'Ver más', 'siemet-mini' ); ?> <svg class="lucide lucide-arrow-up-right" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg></a>
		</div>
	</article>
<?php else : ?>
	<article class="project-card">
		<img class="project-card__image" src="<?php echo esc_url( $image ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" loading="lazy">
		<div class="project-card__veil" aria-hidden="true"></div>
		<div class="project-card__content">
			<div class="project-label"><span aria-hidden="true"></span><?php echo esc_html( siemet_mini_project_sector() ); ?></div>
			<div class="project-card__copy">
				<h2 class="heading heading--medium"><?php the_title(); ?></h2>
				<div class="project-meta">
					<?php if ( $client ) : ?><p><?php echo esc_html( 'Cliente: ' . $client ); ?></p><?php endif; ?>
					<?php if ( $scope ) : ?><p><?php echo esc_html( 'Alcance: ' . $scope ); ?></p><?php endif; ?>
				</div>
				<a class="project-link" href="<?php the_permalink(); ?>" data-transition-title="<?php echo esc_attr( get_the_title() ); ?>"><?php esc_html_e( 'Ver proyecto', 'siemet-mini' ); ?> <svg class="lucide lucide-arrow-up-right" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg></a>
			</div>
		</div>
	</article>
<?php endif; ?>
