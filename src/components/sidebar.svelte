<script type="text/javascript">
// @ts-nocheck

	import { fly, scale } from 'svelte/transition';
	import swal from 'sweetalert';
	import Cookie from 'js-cookie';

	let settings_drop = 0;

	export let activePage = ""
	export let role

	let logout = () => {
		swal({
			title: "Leaving So Soon?",
			icon: "warning",
			buttons:{
				cancel : {
					text : 'No!',
					value : null,
					visible : true,
					className : 'btn btn-outline-secondary',
					closeModal : true
				},
				confirm : {
					text : 'Yes!',
					value : true,
					visible : true,
					className : 'btn btn-primary',
					closeModal : true
				}
			}
		}).then((isLogout) => {
			if (isLogout) {
				Cookie.remove('role')
				Cookie.remove('username')
				Cookie.remove('email')

				if(role == 'mentor'){
					Cookie.remove('token')
					Cookie.remove('image')
				}

				swal({
					title: "Logout Successfully!",
					text: 'See you soon 👋',
					icon: "success"
				}).then(() => {
					window.location.reload()
				})
			}
		})
	}
</script>

<aside id="layout-menu" class="layout-menu menu-vertical menu overflow-hidden" style="min-height: 100vh;">
	<div class="position-fixed h-100 d-flex flex-column justify-content-between bg-menu-theme">
		<div class="my-0">
			<div class="app-brand demo">
				<a href="/super-admin/dashboard" class="app-brand-link">
					<span class="app-brand-text demo menu-text fw-bolder">MMaS</span>
				</a>
				<a href="#" class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
					<i class="bx bx-chevron-left bx-sm align-middle" />
				</a>
			</div>
		
			<div class="menu-inner-shadow" />
			
			{#if role == 'admin'}
			<ul class="menu-inner py-1">
				<!-- Dashboard -->
				<li class="menu-item {activePage == "dashboard" ? 'active' : ''}">
					<a href="/super-admin/dashboard" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "dashboard" ? 'bxs-grid-alt' : 'bx-grid-alt'}" />
						<div>Dashboard</div>
					</a>
				</li>
				<li class="menu-item {activePage == "batch" ? 'active' : ''}">
					<a href="/super-admin/batch" class="menu-link">
						<i class='menu-icon tf-icons bx {activePage == "batch" ? 'bxs-folder' : 'bx-folder'}'></i>
						<div>Batches</div>
					</a>
				</li>
				<li class="menu-item {activePage == "program" ? 'active' : ''}">
					<a href="/super-admin/program" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "program" ? 'bxs-extension' : 'bx-extension'}" />
						<div>Programs</div>
					</a>
				</li>
				<li class="menu-item {activePage == "mentor" ? 'active' : ''}">
					<a href="/super-admin/mentor" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "mentor" ? 'bxs-face' : 'bx-face'}" />
						<div>Mentors</div>
					</a>
				</li>
				<li class="menu-item {activePage == "mentee" ? 'active' : ''}">
					<a href="/super-admin/mentee" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "mentee" ? 'bxs-group' : 'bx-group'}" />
						<div>Mentees</div>
					</a>
				</li>
				<li class="menu-item {activePage == "group" ? 'active' : ''}">
					<a href="/super-admin/group" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "group" ? 'bxs-cube' : 'bx-cube'}" />
						<div>Groups</div>
					</a>
				</li>
				<li class="menu-item {activePage == "activity" ? 'active' : ''}">
					<a href="/super-admin/activity" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "activity" ? 'bxs-chalkboard' : 'bx-chalkboard'}" />
						<div>Activities</div>
					</a>
				</li>
				<li class="menu-item {activePage == "absence" ? 'active' : ''}">
					<a href="/super-admin/absence" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "absence" ? 'bxs-calendar-event' : 'bx-calendar-event'}" />
						<div>Absences</div>
					</a>
				</li>
				<li class="menu-item {activePage == "assignment" ? 'active' : ''}">
					<a href="/super-admin/assignment" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "assignment" ? 'bxs-server' : 'bx-server'}" />
						<div>Assignments</div>
					</a>
				</li>
				<li class="menu-item {activePage == "scoring" ? 'active' : ''}">
					<a href="/super-admin/scoring" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "scoring" ? 'bxs-detail' : 'bx-detail'}" />
						<div>Scorings</div>
					</a>
				</li>
				<li class="menu-item {activePage == "recap" ? 'active' : ''}">
					<a href="/super-admin/recap" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "recap" ? 'bxs-collection' : 'bx-collection'}" />
						<div>All Recap</div>
					</a>
				</li>
			</ul>
			{:else if role == 'mentor'}
			<ul class="menu-inner py-1">
				<!-- Dashboard -->
				<li class="menu-item {activePage == "dashboard" ? 'active' : ''}">
					<a href="/mentor/dashboard" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "dashboard" ? 'bxs-grid-alt' : 'bx-grid-alt'}" />
						<div>Dashboard</div>
					</a>
				</li>
				<li class="menu-item {activePage == "program" ? 'active' : ''}">
					<a href="/mentor/program" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "program" ? 'bxs-extension' : 'bx-extension'}" />
						<div>Programs</div>
					</a>
				</li>
				<li class="menu-item {activePage == "mentor" ? 'active' : ''}">
					<a href="/mentor/mentor" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "mentor" ? 'bxs-face' : 'bx-face'}" />
						<div>Mentors</div>
					</a>
				</li>
				<li class="menu-item {activePage == "mentee" ? 'active' : ''}">
					<a href="/mentor/mentee" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "mentee" ? 'bxs-group' : 'bx-group'}" />
						<div>Mentees</div>
					</a>
				</li>
				<li class="menu-item {activePage == "group" ? 'active' : ''}">
					<a href="/mentor/group" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "group" ? 'bxs-cube' : 'bx-cube'}" />
						<div>Groups</div>
					</a>
				</li>
				<li class="menu-item {activePage == "absence" ? 'active' : ''}">
					<a href="/mentor/absence" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "absence" ? 'bxs-calendar-event' : 'bx-calendar-event'}" />
						<div>Absences</div>
					</a>
				</li>
				<li class="menu-item {activePage == "scoring" ? 'active' : ''}">
					<a href="/mentor/scoring" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "scoring" ? 'bxs-detail' : 'bx-detail'}" />
						<div>Scorings</div>
					</a>
				</li>
				<li class="menu-item {activePage == "recap" ? 'active' : ''}">
					<a href="/mentor/recap" class="menu-link">
						<i class="menu-icon tf-icons bx {activePage == "recap" ? 'bxs-collection' : 'bx-collection'}" />
						<div>All Recap</div>
					</a>
				</li>
			</ul>
			{/if}
		</div>

		<div class="mb-3">
			<ul class="menu-inner py-1">
				<li class="menu-item {activePage == "logout" ? 'active' : ''}">
					<a href="#" class="menu-link" on:click={() => logout()}>
						<i class="menu-icon tf-icons bx {activePage == "logout" ? 'bxs-log-out' : 'bx-log-out'}" />
						<div>Logout</div>
					</a>
				</li>
			</ul>
		</div>
	</div>
</aside>
