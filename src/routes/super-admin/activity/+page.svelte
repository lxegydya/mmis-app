<script>
// @ts-nocheck

    import Sidebar from "../../../components/sidebar.svelte";
    import Navbar from "../../../components/navbar.svelte";
	import ApiController from "../../../ApiController";
	import { onMount } from "svelte";
	import toDate from "../../../CustomTime";

    let data = null
    let status = false

    let getActivities = () => {
        ApiController({
            method:"GET",
            endpoint:'activity'
        }).then(response => {
            data = response?.data.data
            status = true
        })
    }

    let deleteActivity = id => {
        ApiController({
            method:"POST",
            endpoint:'activity/delete',
            datas:{id}
        }).then(response => {
            if(response.data.msg == 'success'){
                alert('Activity Deleted!')
                getActivities()
            }
        })
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
	<Sidebar activePage="activity" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
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
                                        <input type="text" class="form-control" id="filter-name" placeholder="Activity Name">
                                    </div>
									<div class="input-group">
                                        <select id="filter-category" class="form-select">
                                            <option value="" selected>All Batches</option>
                                            <option value="Upcoming">Upcoming</option>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Finished">Finished</option>
                                        </select>
                                    </div>
									<div class="input-group">
                                        <select id="filter-category" class="form-select">
                                            <option value="" selected>All Programs</option>
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <select id="filter-category" class="form-select">
                                            <option value="" selected>All Activity Type</option>
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
                                        {#each data.activities as a, i}
                                        <tr>
                                            <td>{i+1}</td>
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