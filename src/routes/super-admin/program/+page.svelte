<script>
// @ts-nocheck

    import Sidebar from "../../../components/sidebar.svelte";
    import Navbar from "../../../components/navbar.svelte";
	import ApiController from "../../../ApiController";
	import { onMount } from "svelte";
	import jquery from "jquery";

	let programList = null
	let programReal = null

	let programTotal = null
	let ongoingProgram = null
	let programCategories = null
	let programStatus = null

	let status = false

	let getPrograms = () => {
		ApiController({
			method:"GET",
			endpoint:`programs`
		}).then(response => {
			programTotal = response.data.data.program_total
			ongoingProgram = response.data.data.ongoing_program
			programCategories = response.data.data.categories
			programStatus = response.data.data.status
			programReal = response.data.data.programs
			programList = programReal
			status = true
		})
	}

	let deleteProgram = program_id => {
		ApiController({
			method:"POST",
			endpoint:`program/delete/${program_id}`,
		}).then(response => {
			if(response.data.msg == 'success'){
				alert("Program Deleted!")
				getPrograms()
			}
		})
	}

	onMount(async () => {
		getPrograms()
	})
</script>

<div class="d-flex h-100">
	<Sidebar activePage="program" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">Programs</h4>
				{#if status}
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
								<span class="fw-semibold d-block mb-1">Program Total</span>
								<div class="d-flex align-items-center gap-2">
									<h3 class="card-title mb-2">{programTotal < 10 ? '0' + programTotal : programTotal}</h3>
									<span class="fw-light d-block mb-1">Programs</span>
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
								<span class="fw-semibold d-block mb-1">Ongoing Program</span>
								<div class="d-flex align-items-center gap-2">
									<h3 class="card-title mb-2">{ongoingProgram < 10 ? '0' + ongoingProgram : ongoingProgram}</h3>
									<span class="fw-light d-block mb-1">Programs</span>
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
								<span class="fw-semibold d-block mb-1">Program Category</span>
								<div class="d-flex align-items-center gap-2">
									<h3 class="card-title mb-2">{programCategories.length < 10 ? '0' + programCategories.length : programCategories.length}</h3>
									<span class="fw-light d-block mb-1">Categories</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Programs</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <input type="text" class="form-control" id="filter-name" placeholder="Program Name">
                                    </div>
									<div class="input-group">
                                        <select id="filter-category" class="form-select">
                                            <option value="" selected>All Batch</option>
                                            <option value="Upcoming">Upcoming</option>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Finished">Finished</option>
                                        </select>
                                    </div>
									<div class="input-group">
                                        <select id="filter-category" class="form-select">
                                            <option value="" selected>All Category</option>
                                            {#each programCategories as cat}
                                            <option value="{cat}">{cat}</option>
											{/each}
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <select id="filter-status" class="form-select">
                                            <option value="" selected>All Status</option>
											{#each programStatus as stat}
                                            <option value="{stat}">{stat}</option>
											{/each}
                                        </select>
                                    </div>
                                    <button type="button" class="btn btn-primary text-nowrap" on:click={() => window.location.href = '/super-admin/program/create'}>
                                        <span class="tf-icons bx bx-plus me-1"></span>Program
                                    </button>
                                </div>
                            </div>
							<div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th>NO.</th>
											<th>Program Name</th>
											<th>Batch</th>
											<th>Category</th>
											<th>Status</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{#if programList.length > 0}
										{#each programList as p, i}
										<!-- svelte-ignore a11y-mouse-events-have-key-events -->
										<tr id="data-{p.id}" on:mouseover={() => {
											jquery(`#data-${p.id}`).css('cursor', 'pointer')
										}}>
											<td>{i+1}</td>
											<td>{p.program_name}</td>
											<td>{p.batch_name}</td>
											<td>{p.program_categorie}</td>
											{#if p.program_status == 'Upcoming'}
											<td class="text-secondary">{p.program_status}</td>
											{:else if p.program_status == 'Ongoing'}
											<td class="text-warning">{p.program_status}</td>
											{:else if p.program_status == 'Finished'}
											<td class="text-success">{p.program_status}</td>
											{/if}
											<td>
												<!-- svelte-ignore missing-declaration -->
												<button type="button" class="btn btn-sm btn-outline-warning" on:click={(event) => {
													event.stopPropagation()
													window.location.href = `/super-admin/program/edit/${p.id}`
												}}>Edit</button>
                                                <!-- svelte-ignore missing-declaration -->
                                                <button type="button" class="btn btn-sm btn-outline-danger" on:click={(event) => {
													event.stopPropagation()
													deleteProgram(p.id)
												}}>Delete</button>
											</td>
										</tr>
										{/each}
										{/if}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				{/if}
            </div>
        </div>
    </div>
</div>