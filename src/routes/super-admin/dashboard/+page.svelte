<script>
// @ts-nocheck

	import Sidebar from '../../../components/sidebar.svelte';
	import Navbar from '../../../components/navbar.svelte';
	import Footer from '../../../components/footer.svelte';
	import { onMount } from 'svelte';
	import jquery from 'jquery';
	import ApiController from '../../../ApiController';

	let status = false
	let dashboardData = null

	let getDashboard = () => {
		ApiController({
			method:"GET",
			endpoint:`admin/dashboard`
		}).then(response => {
			dashboardData = response.data.data
			status = true
		})
	}

	onMount(async () => {
		// @ts-ignore

		getDashboard()
	});
</script>

<svelte:head>
	<title>Dashboard</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="dashboard" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
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
								<div class="card-title d-flex align-items-start justify-content-between">
									<div class="avatar flex-shrink-0">
										<img
											src="/img/icons/unicons/chart-success.png"
											alt="chart success"
											class="rounded"
										/>
									</div>
								</div>
								<span class="fw-semibold d-block mb-1">Batch Total</span>
								<div class="d-flex align-items-center gap-2">
									<h3 class="card-title mb-2">{dashboardData.total_batch < 10 ? '0' + dashboardData.total_batch : dashboardData.total_batch}</h3><span class="fw-light d-block mb-1">Batches</span>
								</div>
							</div>
						</div>
					</div>
					<div class="col-lg-3 col-md-4 col-12 mb-4">
						<div class="card">
							<div class="card-body">
								<div class="card-title d-flex align-items-start justify-content-between">
									<div class="avatar flex-shrink-0">
										<img
											src="/img/icons/unicons/chart-success.png"
											alt="chart success"
											class="rounded"
										/>
									</div>
									<span class="fw-light d-block mb-1">{dashboardData.ongoing_batch}</span>
								</div>
								<span class="fw-semibold d-block mb-1">Batch Countdown</span>
								<div class="d-flex align-items-center gap-2">
									<h3 class="card-title mb-2">{dashboardData.countdown_ongoing_batch}</h3><span class="fw-light d-block mb-1">Days Remaining</span>
								</div>
							</div>
						</div>
					</div>
					<div class="col-lg-3 col-md-4 col-12 mb-4">
						<div class="card">
							<div class="card-body">
								<div class="card-title d-flex align-items-start justify-content-between">
									<div class="avatar flex-shrink-0">
										<img
											src="/img/icons/unicons/chart-success.png"
											alt="chart success"
											class="rounded"
										/>
									</div>
									<span class="fw-light d-block mb-1">Batch 01</span>
								</div>
								<span class="fw-semibold d-block mb-1">Ongoing Programs</span>
								<div class="d-flex align-items-center gap-2">
									<h3 class="card-title mb-2">{dashboardData.ongoing_program < 10 ? '0' + dashboardData.ongoing_program : dashboardData.ongoing_program}</h3><span class="fw-light d-block mb-1">Programs</span>
								</div>
							</div>
						</div>
					</div>
					<div class="col-lg-3 col-md-4 col-12 mb-4">
						<div class="card">
							<div class="card-body">
								<div class="card-title d-flex align-items-start justify-content-between">
									<div class="avatar flex-shrink-0">
										<img
											src="/img/icons/unicons/chart-success.png"
											alt="chart success"
											class="rounded"
										/>
									</div>
								</div>
								<span class="fw-semibold d-block mb-1">Mentor Total</span>
								<div class="d-flex align-items-center gap-2">
									<h3 class="card-title mb-2">05</h3><span class="fw-light d-block mb-1">Mentors</span>
								</div>
							</div>
						</div>
					</div>
					<div class="col-lg-3 col-md-4 col-12 mb-4">
						<div class="card">
							<div class="card-body">
								<div class="card-title d-flex align-items-start justify-content-between">
									<div class="avatar flex-shrink-0">
										<img
											src="/img/icons/unicons/chart-success.png"
											alt="chart success"
											class="rounded"
										/>
									</div>
								</div>
								<span class="fw-semibold d-block mb-1">Active Mentees</span>
								<div class="d-flex align-items-center gap-2">
									<h3 class="card-title mb-2">83</h3><span class="fw-light d-block mb-1">Mentees</span>
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
