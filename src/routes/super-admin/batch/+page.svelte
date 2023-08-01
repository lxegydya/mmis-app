<script>
	// @ts-nocheck

	import Sidebar from '../../../components/sidebar.svelte';
	import Navbar from '../../../components/navbar.svelte';
	import Footer from '../../../components/footer.svelte';
	import { onMount } from 'svelte';
	import ApiController from '../../../ApiController';
	import jquery from 'jquery';
	import toDate from '../../../CustomTime';
	import swal from 'sweetalert';
	import Pagination from '../../../components/pagination.svelte';
	import pagination from '../../../CustomPagination';
	import returnNada from '../../../CustomReturnNada';

	let currentPage = 1
	let showRowData = 10

	let totalBatch = null
	let ongoingBatch = null
    let batchList = null
	let batchReal = null

	let status = false

    let getBatchList = () => {
        ApiController({
            method: "GET",
            endpoint: `batches`
        }).then(response => {
			totalBatch = response.data.data.batch_total
			ongoingBatch = response.data.data.ongoing_batch
			batchReal = response.data.data.batches
            batchList = batchReal
			status = true
        })
    }

	let filterBatch = () => {
		currentPage = 1
		let batchTemp = batchReal
		let targetName = jquery('#filter-name').val()
		let targetStatus = jquery('#filter-status').val()

		batchList = batchTemp.filter(elm => {
			return elm.batch_name.toLowerCase().includes(targetName) &&
					elm.batch_status.includes(targetStatus)
		})
	}

	let deleteBatch = batch_id => {
		swal({
			title: "Are you sure?",
			text: "Once deleted, you will not be able to recover this data!",
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
					text : 'Yes Sure!',
					value : true,
					visible : true,
					className : 'btn btn-primary',
					closeModal : true
				}
			}
		}).then((willDelete) => {
			if (willDelete) {
				ApiController({
					method:"POST",
					endpoint:`batch/delete/${batch_id}`,
				}).then(response => {
					if(response.data.msg == 'success'){
						swal("Poof! Data has been deleted!", {
							icon: "success",
							button: {
								text : 'Okay!',
								value : true,
								visible : true,
								className : 'btn btn-primary',
								closeModal : true
							}
						})
						getBatchList()
					}
				})
			}
		})
	}

	onMount(async () => {  
        getBatchList()
	})
</script>

<svelte:head>
	<title>Batches</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="batch" role='admin'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='admin'/>
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					Batches
				</h4>
				{#if  status}
				<div class="row">
					<div class="col-lg-12 col-md-6 col-12">
						<div class="row">
							<div class="col-lg-3 col-md-2 col-6 mb-4">
								<div class="card">
									<div class="card-body">
										<div class="d-flex flex-row justify-content-between align-items-center">
											<div class="">
												<span class="fw-semibold d-block">Batch Total</span>
												<div class="d-flex align-items-end gap-2">
													{#if totalBatch != null}
													<h3 class="mb-0">{totalBatch < 10 ? '0' + totalBatch : totalBatch}</h3>
													{/if}
													<span class="fw-light d-block">Batches</span>
												</div>
											</div>
											<div class="d-flex align-items-center justify-content-center p-2">
												<i class='tf-icons bx bx-md bx-folder'></i>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-lg-3 col-md-2 col-6 mb-4">
								<div class="card">
									<div class="card-body">
										<div class="d-flex flex-row justify-content-between align-items-center">
											<div class="">
												<span class="fw-semibold d-block">Ongoing Batch</span>
												<div class="d-flex align-items-end gap-2">
													{#if ongoingBatch != null}
													<h3 class="mb-0">{ongoingBatch}</h3>
													{/if}
												</div>
											</div>
											<div class="d-flex align-items-center justify-content-center p-2">
												<i class='tf-icons bx bx-md bxs-folder'></i>
											</div>
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
										{#if batchList.length > 0}
										{#if pagination(batchList, currentPage, showRowData).length == 0}
                                        {returnNada(currentPage = currentPage-1)}
                                        {/if}
                                        {#each pagination(batchList, currentPage, showRowData) as b, i}
										<!-- svelte-ignore a11y-mouse-events-have-key-events -->
										<tr id="data-{b.id}" on:mouseover={() => {
											jquery(`#data-${b.id}`).css('cursor', 'pointer')
										}}>
											<th scope="row">{b.number}</th>
											<td>{b.batch_name}</td>
											<td>{toDate(b.batch_start)}</td>
											<td>{toDate(b.batch_end)}</td>
											<td>{b.batch_status}</td>
											<td class="d-flex align-items-center gap-2">
                                                <button type="button" class="btn btn-sm btn-outline-warning" on:click={(event) => {
													event.stopPropagation()
													window.location.href = `/super-admin/batch/edit/${b.id}`
												}}>Edit</button>
                                                <button type="button" class="btn btn-sm btn-outline-danger" on:click={(event) => {
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
									</tbody>
								</table>
							</div>
						</div>
						<Pagination bind:currentPage={currentPage} bind:dataList={batchList} showRowData={showRowData} />
					</div>
				</div>
				{/if}
			</div>
		</div>
		<Footer/>
	</div>
</div>
