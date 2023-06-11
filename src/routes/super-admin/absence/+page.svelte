<script>
// @ts-nocheck

    import Sidebar from "../../../components/sidebar.svelte";
    import Navbar from "../../../components/navbar.svelte";
    import ApiController from "../../../ApiController";
	import { onMount } from "svelte";

    let status = false
    let data = null

    let getData = () => {
        ApiController({
            method:"GET",
            endpoint:'super-admin/absence'
        }).then(response => {
            data = response?.data.data
            console.log(data)
            status = true
        })
    }

    onMount(async () => {
        getData()
    })
</script>

<svelte:head>
	<title>Absences</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="absence" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					Absences
				</h4>
                {#if status}
                <div class="row mb-3">
                    <div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Choose Program</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <input type="text" class="form-control" id="filter-name" placeholder="Program Name">
                                    </div>
									<div class="input-group">
                                        <select id="filter-category" class="form-select">
                                            <option value="" selected>All Batches</option>
                                            <option value="Upcoming">Upcoming</option>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Finished">Finished</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    {#each data as d}
                    <div class="col-lg-6 col-md-12">
                        <a href="/super-admin/absence/fill-absence/{d.program_id}" class="rounded bg-white list-group-item list-group-item-action flex-column align-items-start h-100">
                            <div class="d-flex justify-content-between w-100">
                                <p class="mb-3">{d.batch_name}</p>
                                <small>{d.mentees} Mentees Assigned</small>
                            </div>
                            <h3 class="mb-1">{d.program_name}</h3>
                            {#if d.program_status == 'Upcoming'}
                            <p class="lead mb-0 text-secondary">{d.program_status} <span class="ms-2 badge rounded-pill px-3 bg-label-info">{d.activities_count} Activities</span></p>
                            {:else if d.program_status == 'Ongoing'}
                            <p class="lead mb-0 text-warning">{d.program_status} <span class="ms-2 badge rounded-pill px-3 bg-label-info">{d.activities_count} Activities</span></p>
                            {:else if d.program_status == 'Finished'}
                            <p class="lead mb-0 text-success">{d.program_status} <span class="ms-2 badge rounded-pill px-3 bg-label-info">{d.activities_count} Activities</span></p>
                            {/if}
                            <small>
                                {#if d.mentors.length > 0}
                                {#each d.mentors as m}
                                <span class="me-2">{m.fullname}</span>
                                {/each}
                                {:else}
                                <span>No Mentor Assigned!</span>
                                {/if}
                            </small>
                        </a>
                    </div>
                    {/each}
                </div>
                {/if}
            </div>
        </div>
    </div>
</div>