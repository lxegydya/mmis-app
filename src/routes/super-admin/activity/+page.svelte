<script>
// @ts-nocheck

    import Sidebar from "../../../components/sidebar.svelte";
    import Navbar from "../../../components/navbar.svelte";
    import Pagination from "../../../components/pagination.svelte";
    import Footer from "../../../components/footer.svelte";
	import ApiController from "../../../ApiController";
	import { onMount } from "svelte";
	import toDate from "../../../CustomTime";
    import pagination from "../../../CustomPagination";
	import jquery from "jquery";
	import returnNada from "../../../CustomReturnNada";

    let data = null
    let activitiesReal = null
    let activities = null
    let programs = null
    let batches = null
    let types = null
    let status = false

    let currentPage = 1
    let showRowData = 10

    let getActivities = () => {
        ApiController({
            method:"GET",
            endpoint:'activity'
        }).then(response => {
            data = response?.data.data
            programs = data.programs
            batches = data.batches
            types = data.types 
            activitiesReal = data.activities.sort((a,b) => new Date(a.date) - new Date(b.date))
            activities = activitiesReal
            status = true
        })
    }

    let deleteActivity = id => {
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
                    endpoint:'activity/delete',
                    datas:{id}
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
                        getActivities()
                    }
                })
            }
        })
    }

    let filterAssignment = () => {
        currentPage = 1
        activities = activitiesReal
        let tempActivities = activities
        let targetName = jquery('#filter-name').val().toLowerCase()
        let targetBatch = jquery('#filter-batch').val().toLowerCase()
        let targetProgram = jquery('#filter-program').val().toLowerCase()
        let targetType = jquery('#filter-type').val().toLowerCase()

        tempActivities = tempActivities.filter(m => {
            return m.name.toLowerCase().includes(targetName) &&
                m.batch_name.toLowerCase().includes(targetBatch) &&
                m.program_name.toLowerCase().includes(targetProgram) &&
                m.type.toLowerCase().includes(targetType)
        })

        activities = tempActivities
    }

    onMount(async () => {
        getActivities()
    })
</script>

<svelte:head>
	<title>Activities</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="activity" role='admin'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='admin'/>
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					Activities
				</h4>
                {#if status}
                <div class="row">
                    <div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Activities</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <input type="text" class="form-control" id="filter-name" placeholder="Activity Name" on:keyup={() => {filterAssignment()}}>
                                    </div>
                                    <div class="input-group">
                                        <select id="filter-batch" class="form-select" on:change={() => {filterAssignment()}}>
                                            <option value="" selected>All Batches</option>
                                            {#each batches as b}
                                                <option value="{b.batch_name}">{b.batch_name}</option>
                                            {/each}
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <select id="filter-program" class="form-select" on:change={() => {filterAssignment()}}>
                                            <option value="" selected>All Programs</option>
                                            {#each programs as p}
                                            <option value="{p.program_name}">{p.program_name}</option>
                                            {/each}
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <select id="filter-type" class="form-select" on:change={() => {filterAssignment()}}>
                                            <option value="" selected>All Type</option>
                                            {#each types as t}
                                            <option value="{t.type}">{t.type}</option>
                                            {/each}
                                        </select>
                                    </div>
                                    <button type="button" class="btn btn-outline-primary text-nowrap" on:click={() => window.location.href = '/super-admin/activity/manage-type'}>
                                        Manage Activity Type
                                    </button>
                                    <button type="button" class="btn btn-primary text-nowrap" on:click={() => window.location.href = '/super-admin/activity/create'}>
                                        <span class="tf-icons bx bx-plus me-1"></span>Activity
                                    </button>
                                </div>
                            </div>
							<div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th>NO.</th>
											<th>Activity Name</th>
											<th>Batch</th>
											<th>Program</th>
											<th>Date</th>
                                            <th>Type of Activity</th>
											<th class="text-center">Action</th>
										</tr>
									</thead>
                                    <tbody>
                                        {#if activities.length > 0}
                                        {#if pagination(activities, currentPage, showRowData).length == 0}
                                        {returnNada(currentPage = currentPage-1)}
                                        {/if}
                                        {#each pagination(activities, currentPage, showRowData) as a, i}
                                        <tr>
                                            <td>{(showRowData*(currentPage-1)) + i+1}</td>
                                            <td>{a.name}</td>
                                            <td>{a.batch_name}</td>
                                            <td>{a.program_name}</td>
                                            <td>{toDate(a.date)}</td>
                                            <td>{a.type}</td>
                                            <td class="text-center">
                                                <button class="btn btn-sm btn-outline-warning" on:click={() => {
                                                    window.location.href = `/super-admin/activity/edit/${a.id}`
                                                }}>Edit</button>
                                                <button class="btn btn-sm btn-outline-danger" on:click={() => {
                                                    deleteActivity(a.id)
                                                }}>Delete</button>
                                            </td>
                                        </tr>
                                        {/each}
                                        {:else}
                                        <tr><td colspan='7' class="text-center">No Data</td></tr>
                                        {/if}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Pagination bind:currentPage={currentPage} bind:dataList={activities} showRowData={showRowData}/>
                </div>
                {/if}
            </div>
        </div>
        <Footer/>
    </div>
</div>