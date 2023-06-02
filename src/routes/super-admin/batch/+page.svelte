<script>
	// @ts-nocheck

	import Sidebar from '../../../components/sidebar.svelte';
	import Navbar from '../../../components/navbar.svelte';
	import { onMount } from 'svelte';
	import ApiController from '../../../ApiController';
	import jquery from 'jquery';

    let loginStatus = false

	let totalBatch = null
	let ongoingBatch = null
    let batchList = null
	let batchReal = null

    let getBatchList = () => {
        ApiController({
            method: "GET",
            endpoint: `batches`
        }).then(response => {
			totalBatch = response.data.data.batch_total
			ongoingBatch = response.data.data.ongoing_batch
            batchList = response.data.data.batches
			batchReal = response.data.data.batches
        })
    }

	let filterBatch = () => {
		let batchTemp = batchReal

		let targetName = jquery('#filter-name').val()
		let targetStatus = jquery('#filter-status').val()

		console.log(targetName)
		console.log(targetStatus)

		batchList = batchTemp.filter(elm => {
			return elm.batch_name.toLowerCase().includes(targetName) &&
					elm.batch_status.includes(targetStatus)
		})

		console.log(batchList)
	}

	let deleteBatch = batch_id => {
		ApiController({
			method:"POST",
			endpoint:`batch/delete/${batch_id}`,
		}).then(response => {
			if(response.data.msg == 'success'){
				alert("Batch Deleted!")
				window.location.reload()
			}
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
        
        getBatchList()
	})
</script>

<div class="d-flex h-100">
	<Sidebar activePage="batch" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					Batches
				</h4>
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
											{#if totalBatch != null}
											<h3 class="card-title mb-2">{totalBatch < 10 ? '0' + totalBatch : totalBatch}</h3>
											{/if}
											<span class="fw-light d-block mb-1">Batches</span>
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
										<span class="fw-semibold d-block mb-1">Ongoing Batch</span>
										<div class="d-flex align-items-center gap-2">
											{#if ongoingBatch != null}
											<h3 class="card-title mb-2">{ongoingBatch}</h3>
											{/if}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Batches</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <span class="input-group-text" id="basic-addon-search31"><i class="bx bx-search"></i></span>
                                        <input type="text" class="form-control" placeholder="Batch Name" id="filter-name" on:keyup={() => filterBatch()}>
                                    </div>
                                    <div class="input-group">
                                        <select id="filter-status" class="form-select" on:change={() => filterBatch()}>
                                            <option value="" selected>All Status</option>
                                            <option value="Upcoming">Upcoming</option>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Finished">Finished</option>
                                        </select>
                                    </div>
                                    <button type="button" class="btn btn-primary text-nowrap" on:click={() => window.location.href = '/super-admin/batch/create'}>
                                        <span class="tf-icons bx bx-plus me-1"></span>Batch
                                    </button>
                                </div>
                            </div>
							<div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th>NO.</th>
											<th>Batch Name</th>
											<th>Start</th>
											<th>End</th>
											<th>Status</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
                                        {#if batchList != null}
										{#if batchList.length > 0}
                                        {#each batchList as b, i}
										<!-- svelte-ignore a11y-mouse-events-have-key-events -->
										<tr id="data-{b.id}" on:mouseover={() => {
											jquery(`#data-${b.id}`).css('cursor', 'pointer')
										}} on:click={() => window.location.href = `/super-admin/batch/detail/${b.id}`}>
											<th scope="row">{i+1}</th>
											<td>{b.batch_name}</td>
											<td>{b.batch_start}</td>
											<td>{b.batch_end}</td>
											<td>{b.batch_status}</td>
											<td class="d-flex align-items-center gap-2">
                                                <button type="button" class="btn btn-sm btn-outline-warning" on:click={(event) => {
													event.stopPropagation()
													window.location.href = `/super-admin/batch/edit/${b.id}`
												}}>Edit</button>
                                                <button type="button" class="btn btn-sm btn-outline-danger" on:click={() => {
													event.stopPropagation()
													deleteBatch(b.id)
												}}>Delete</button>
                                            </td>
										</tr>
                                        {/each}
										{:else}
										<tr>
											<td colspan="6" class="text-center">No Data</td>
										</tr>
										{/if}
										{:else}
										<tr>
											<td colspan="6" class="text-center">No Data</td>
										</tr>
                                        {/if}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
