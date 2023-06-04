<script>
// @ts-nocheck

	import Sidebar from '../../../components/sidebar.svelte';
	import Navbar from '../../../components/navbar.svelte';
	import { onMount } from 'svelte';
	import jquery from 'jquery';
	import ApiController from '../../../ApiController';

	let loginStatus = false;

	let dashboardData = null

	let getDashboard = () => {
		ApiController({
			method:"GET",
			endpoint:`admin/dashboard`
		}).then(response => {
			dashboardData = response.data.data
		})
	}

	onMount(async () => {
		// @ts-ignore
		let loginData = JSON.parse(window.localStorage.getItem('login-data'));
		if (loginData) {
			loginStatus = true;
		} else {
			window.location.href = '/';
		}

		getDashboard()
	});
</script>


<div class="d-flex h-100">
	<Sidebar activePage="dashboard" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					Dashboard
				</h4>
				{#if loginStatus && dashboardData}
				<div class="row">
					<div class="col-lg-12 col-md-6 col-12">
						<div class="row">
							<div class="col-lg-2 col-md-2 col-6 mb-4">
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
							<div class="col-lg-2 col-md-2 col-6 mb-4">
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
							<div class="col-lg-2 col-md-2 col-6 mb-4">
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
							<div class="col-lg-2 col-md-2 col-6 mb-4">
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
							<div class="col-lg-2 col-md-2 col-6 mb-4">
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
					</div>
				</div>
				{/if}
			</div>
		</div>
	</div>
</div>
