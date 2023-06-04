<script type="text/javascript">
	import { fly, scale } from 'svelte/transition';

	let settings_drop = 0;

	export let activePage = ""
</script>

<aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme overflow-hidden" style="min-height: 100vh;">
	<div class="position-fixed h-100">
		<div class="app-brand demo">
			<a href="/super-admin/dashboard" class="app-brand-link">
				<span class="app-brand-text demo menu-text fw-bolder ms-2">MMIS</span>
			</a>
			<a href="/super-admin/dashboard" class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
				<i class="bx bx-chevron-left bx-sm align-middle" />
			</a>
		</div>
	
		<div class="menu-inner-shadow" />
	
		<ul class="menu-inner py-1">
			<!-- Dashboard -->
			<li class="menu-item {activePage == "dashboard" ? 'active' : ''}">
				<a href="/super-admin/dashboard" class="menu-link">
					<i class="menu-icon tf-icons bx bx-home-circle" />
					<div>Dashboard</div>
				</a>
			</li>
			<li class="menu-item {activePage == "batch" ? 'active' : ''}">
				<a href="/super-admin/batch" class="menu-link">
					<i class="menu-icon tf-icons bx bx-file" />
					<div>Batches</div>
				</a>
			</li>
			<li class="menu-item {activePage == "program" ? 'active' : ''}">
				<a href="/super-admin/program" class="menu-link">
					<i class="menu-icon tf-icons bx bx-file" />
					<div>Programs</div>
				</a>
			</li>
			<li class="menu-item {activePage == "mentor" ? 'active' : ''}">
				<a href="/super-admin/mentor" class="menu-link">
					<i class="menu-icon tf-icons bx bx-file" />
					<div>Mentors</div>
				</a>
			</li>
			<li class="menu-item {activePage == "mentee" ? 'active' : ''}">
				<a href="/super-admin/mentee" class="menu-link">
					<i class="menu-icon tf-icons bx bx-file" />
					<div>Mentees</div>
				</a>
			</li>
			<li class="menu-item {activePage == "group" ? 'active' : ''}">
				<a href="/super-admin/group" class="menu-link">
					<i class="menu-icon tf-icons bx bx-file" />
					<div>Groups</div>
				</a>
			</li>
		</ul>
	</div>
</aside>
