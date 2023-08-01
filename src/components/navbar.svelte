<script type="text/javascript">
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition'
	import Cookie from 'js-cookie'
	import swal from 'sweetalert';

	export let role

	let loginData = null

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

	onMount(async () => {
		if(Cookie.get('role') == undefined){
			window.location.href = '/'
		}else{
			if(Cookie.get('role') == 'admin' && role != 'admin'){
				swal({
					title: "Access Denied!",
					text: 'You dont have access to this URL',
					icon: "warning",
					button: {
						text : 'Oops Sorry!',
						value : true,
						visible : true,
						className : 'btn btn-primary',
						closeModal : true
					}
				}).then(action => {
					window.location.href = '/super-admin/dashboard'
				})
			}else if(Cookie.get('role') == 'mentor' && role != 'mentor'){
				swal({
					title: "Access Denied!",
					text: 'You dont have access to this URL',
					icon: "warning",
					button: {
						text : 'Oops Sorry!',
						value : true,
						visible : true,
						className : 'btn btn-primary',
						closeModal : true
					}
				}).then(action => {
					window.location.href = '/mentor/dashboard'
				})
			}
		}
	})
</script>

<nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
	<div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
		<a class="nav-item nav-link px-0 me-xl-4" href="#">
			<i class="bx bx-menu bx-sm" />
		</a>
	</div>

	<div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
		<!-- Search -->
		<div class="navbar-nav">
			<p class="mb-0">Welcome, {Cookie.get('username') == undefined ? '' : Cookie.get('username')}</p>
		</div>
		<!-- /Search -->

		<ul class="navbar-nav flex-row align-items-center ms-auto">
			<!-- User -->
			<li class="nav-item navbar-dropdown dropdown-user dropdown">
				<a class="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
					<div class="avatar avatar-online">
						{#if role == 'admin'}
						<img src="/img/avatars/user.png" class="rounded" alt=""/>
						{:else}
						<img src="{Cookie.get('image') == null ? '' : `http://127.0.0.1/mmis-api/public/${Cookie.get('image')}`}" class="rounded" alt=""/>
						{/if}
					</div>
				</a>
				<ul class="dropdown-menu dropdown-menu-end">
					<li>
						<a class="dropdown-item" href="#">
							<div class="d-flex">
								<div class="flex-shrink-0 me-3">
									<div class="avatar avatar-online">
										{#if role == 'admin'}
										<img src="/img/avatars/user.png" class="rounded" alt=""/>
										{:else}
										<img src="{Cookie.get('image') == null ? '' : `http://127.0.0.1/mmis-api/public/${Cookie.get('image')}`}" class="rounded" alt=""/>
										{/if}
									</div>
								</div>
								<div class="flex-grow-1">
									<span class="fw-semibold d-block">{Cookie.get('username') == undefined ? '' : Cookie.get('username')}</span>
									<small class="text-muted">{Cookie.get('role') == undefined ? '' : Cookie.get('role')[0].toUpperCase() + Cookie.get('role').slice(1)}</small>
								</div>
							</div>
						</a>
					</li>
					<li>
						<div class="dropdown-divider" />
					</li>
					{#if Cookie.get('role') != undefined && Cookie.get('role') == 'mentor'}
					<li>
						<a class="dropdown-item" href="/mentor/profile">
							<i class="bx bx-user me-2" />
							<span class="align-middle">My Profile</span>
						</a>
					</li>
					<li>
						<a class="dropdown-item" href="/mentor/setting/password">
							<i class="bx bx-cog me-2" />
							<span class="align-middle">Settings</span>
						</a>
					</li>
					<li>
						<div class="dropdown-divider" />
					</li>
					{/if}
					<li>
						<button class="dropdown-item" on:click={() => logout()}>
							<i class="bx bx-power-off me-2" />
							<span class="align-middle">Log Out</span>
						</button>
					</li>
				</ul>
			</li>
			<!--/ User -->
		</ul>
	</div>
</nav>
