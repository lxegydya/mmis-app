<script>
// @ts-nocheck

	import Sidebar from '../../../components/sidebar.svelte';
	import Navbar from '../../../components/navbar.svelte';
	import Footer from '../../../components/footer.svelte';
	import { onMount } from 'svelte';
	import jquery from 'jquery';
	import ApiController from '../../../ApiController';
	import Cookie from 'js-cookie'

	let status = false
	let dashboardData = null

	let getDashboard = () => {
		ApiController({
			method:"POST",
			endpoint:`mentor/dashboard`,
			datas: {
				mentor_id : Cookie.get('token')
			}
		}).then(response => {
			dashboardData = response.data.data
			status = true
		})
	}

	onMount(async () => {
		getDashboard()
	});
</script>

<svelte:head>
	<title>Dashboard</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="dashboard" role='mentor'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='mentor'/>
		{#if !status}
		<div class="d-flex flex-column h-100 w-100 align-items-center justify-content-center">
			<div class="spinner-border spinner-border-lg text-secondary" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
			<p class="lead mb-0 mt-3">Loading</p>
		</div>
		{:else}
		<div class="wrapper {status ? '' : 'h-100'}">
			<div class="container-xxl flex-grow-1 container-p-y {status ? '' : 'h-100'}">
				<h4 class="fw-bold py-3 mb-4">
					Dashboard
				</h4>
				{#if status}
				<div class="row">
					<div class="col-lg-3 col-md-4 col-12 mb-4">
						<div class="card">
							<div class="card-body">
								<div class="d-flex flex-row justify-content-between align-items-center">
									<div class="">
										<span class="fw-semibold d-block">Ongoing Programs | {dashboardData.ongoing_batch}</span>
										<div class="d-flex align-items-end gap-2">
											<h3 class="mb-0">{dashboardData.ongoing_program < 10 ? '0' + dashboardData.ongoing_program : dashboardData.ongoing_program}</h3>
											<span class="fw-light d-block">Programs</span>
										</div>
									</div>
									<div class="d-flex align-items-center justify-content-center p-2">
										<i class='tf-icons bx bx-md bx-extension'></i>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-lg-3 col-md-4 col-12 mb-4">
						<div class="card">
							<div class="card-body">
								<div class="d-flex flex-row justify-content-between align-items-center">
									<div class="">
										<span class="fw-semibold d-block">Mentor Total</span>
										<div class="d-flex align-items-end gap-2">
											<h3 class="mb-0">{dashboardData.mentors < 10 ? '0' + dashboardData.mentors : dashboardData.mentors}</h3>
											<span class="fw-light d-block">Mentors</span>
										</div>
									</div>
									<div class="d-flex align-items-center justify-content-center p-2">
										<i class='tf-icons bx bx-md bx-face'></i>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-lg-3 col-md-4 col-12 mb-4">
						<div class="card">
							<div class="card-body">
								<div class="d-flex flex-row justify-content-between align-items-center">
									<div class="">
										<span class="fw-semibold d-block">Your Active Mentees</span>
										<div class="d-flex align-items-end gap-2">
											<h3 class="mb-0">{dashboardData.active_mentee < 10 ? '0' + dashboardData.active_mentee : dashboardData.active_mentee}</h3>
											<span class="fw-light d-block">Mentees</span>
										</div>
									</div>
									<div class="d-flex align-items-center justify-content-center p-2">
										<i class='tf-icons bx bx-md bx-group'></i>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/if}
			</div>
		</div>
		{/if}
		<Footer/>
	</div>
</div>
