<script>
// @ts-nocheck

    import Sidebar from "../../../components/sidebar.svelte";
    import Navbar from "../../../components/navbar.svelte";
	import Footer from "../../../components/footer.svelte";
	import ApiController from "../../../ApiController";
	import { onMount } from "svelte";
	import jquery from "jquery";
	import Pagination from "../../../components/pagination.svelte";
	import pagination from "../../../CustomPagination";
	import returnNada from "../../../CustomReturnNada";

	let currentPage = 1
	let showRowData = 10

	let programList = null
	let programReal = null

	let programTotal = null
	let ongoingProgram = null
	let programCategories = null
	let programStatus = null
	let batches = null

	let status = false

	let getPrograms = () => {
		ApiController({
			method:"GET",
			endpoint:`programs`
		}).then(response => {
			batches = response.data.data.batches
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
					endpoint:`program/delete/${program_id}`,
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
						getPrograms()
					}
				})
			}
		})
	}

	let filterProgram = () => {
		currentPage = 1
        programList = programReal
        let tempProgram = programList
        let targetName = jquery('#filter-name').val().toLowerCase()
        let targetBatch = jquery('#filter-batch').val().toLowerCase()
        let targetCategory = jquery('#filter-category').val().toLowerCase()

        tempProgram = tempProgram.filter(m => {
            return m.program_name.toLowerCase().includes(targetName) &&
                m.batch_name.toLowerCase().includes(targetBatch) &&
                m.program_categorie.toLowerCase().includes(targetCategory)
        })

        programList = tempProgram
    }

	onMount(async () => {
		getPrograms()
	})
</script>

<svelte:head>
	<title>Programs</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="program" role='admin'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='admin'/>
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">Programs</h4>
				{#if status}
				<div class="row">
					<div class="col-lg-3 col-md-2 col-6 mb-4">
						<div class="card">
							<div class="card-body">
								<div class="d-flex flex-row justify-content-between align-items-center">
									<div class="">
										<span class="fw-semibold d-block">Program Total</span>
										<div class="d-flex align-items-end gap-2">
											<h3 class="mb-0">{programTotal < 10 ? '0' + programTotal : programTotal}</h3>
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
					<div class="col-lg-3 col-md-2 col-6 mb-4">
						<div class="card">
							<div class="card-body">
								<div class="d-flex flex-row justify-content-between align-items-center">
									<div class="">
										<span class="fw-semibold d-block">Ongoing Program</span>
										<div class="d-flex align-items-end gap-2">
											<h3 class="mb-0">{ongoingProgram < 10 ? '0' + ongoingProgram : ongoingProgram}</h3>
											<span class="fw-light d-block">Programs</span>
										</div>
									</div>
									<div class="d-flex align-items-center justify-content-center p-2">
										<i class='tf-icons bx bx-md bxs-extension'></i>
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
										<span class="fw-semibold d-block">Program Category</span>
										<div class="d-flex align-items-end gap-2">
											<h3 class="mb-0">{programCategories.length < 10 ? '0' + programCategories.length : programCategories.length}</h3>
											<span class="fw-light d-block">Categories</span>
										</div>
									</div>
									<div class="d-flex align-items-center justify-content-center p-2">
										<i class='tf-icons bx bx-md bx-category'></i>
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
                                <h5 class="card-header">Programs</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <input type="text" class="form-control" id="filter-name" placeholder="Program Name" on:keyup={() => {filterProgram()}}>
                                    </div>
									<div class="input-group">
                                        <select id="filter-batch" class="form-select" on:change={() => {filterProgram()}}>
                                            <option value="" selected>All Batch</option>
											{#each batches as b}
                                            <option value="{b.batch_name}">{b.batch_name} | {b.batch_status}</option>
											{/each}
                                        </select>
                                    </div>
									<div class="input-group">
                                        <select id="filter-category" class="form-select" on:change={() => {filterProgram()}}>
                                            <option value="" selected>All Category</option>
                                            {#each programCategories as cat}
                                            <option value="{cat}">{cat}</option>
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
										{#if pagination(programList, currentPage, showRowData).length == 0}
                                        {returnNada(currentPage = currentPage-1)}
                                        {/if}
										{#each pagination(programList, currentPage, showRowData) as p, i}
										<!-- svelte-ignore a11y-mouse-events-have-key-events -->
										<tr id="data-{p.id}" on:mouseover={() => {
											jquery(`#data-${p.id}`).css('cursor', 'pointer')
										}}>
											<td>{p.number}</td>
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
										{:else}
										<tr>
											<td class="text-center" colspan="6">No Data</td>
										</tr>
										{/if}
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<Pagination bind:currentPage={currentPage} bind:dataList={programList} showRowData={showRowData} />
				</div>
				{/if}
            </div>
        </div>
		<Footer/>
    </div>
</div>