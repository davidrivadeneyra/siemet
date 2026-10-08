<footer class="site-footer" id="contacto" data-header-theme="dark">
	<div class="site-footer__inner">
		<div class="site-footer__column site-footer__column--primary">
			<div class="site-footer__brand">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'SIEMET, inicio', 'siemet-mini' ); ?>" data-transition-title="Inicio">
					<img src="<?php echo esc_url( get_theme_file_uri( '/assets/brand/logo-siemet-white.svg' ) ); ?>" alt="SIEMET">
				</a>
				<p class="text-body">SIEMET FZ S.A.C. Trabajamos para convertir la confianza de nuestros clientes en proyectos bien hechos y compromisos cumplidos.</p>
			</div>
			<section class="site-footer__group" aria-labelledby="footer-contact-title">
				<h2 class="site-footer__label heading heading--mini" id="footer-contact-title">Contáctanos</h2>
				<address class="site-footer__links">
					<a class="site-footer__link" href="tel:+51979844607"><span>+51 979 844 607</span></a>
					<a class="site-footer__link" href="mailto:ventas@siemet.pe"><span>ventas@siemet.pe</span></a>
					<span class="site-footer__link">Av. 6 de Noviembre Mz. Q5 Lote 01</span>
				</address>
			</section>
		</div>
		<div class="site-footer__column site-footer__column--secondary">
			<nav class="site-footer__group" aria-labelledby="footer-navigation-title">
				<h2 class="site-footer__label heading heading--mini" id="footer-navigation-title">Navega</h2>
				<div class="site-footer__navigation">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" data-transition-title="Inicio">Inicio</a>
					<a href="<?php echo esc_url( get_post_type_archive_link( 'proyecto' ) ); ?>" data-transition-title="Proyectos">Proyectos</a>
				</div>
			</nav>
		</div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
