<script>
// @ts-nocheck

	import { onMount } from "svelte";
	import ApiController from "../../../ApiController";
    import Navbar from "../../../components/navbar.svelte";
    import Sidebar from "../../../components/sidebar.svelte";
    import Footer from "../../../components/footer.svelte";

    let mentorsList = null
    let status = false

    let getMentors = () => {
        ApiController({
            method:"GET",
            endpoint:`mentors`
        }).then(response => {
            mentorsList = response.data.data
            status = true
        })
    }

    let deleteMentor = mentor_id => {
        ApiController({
            method:"POST",
            endpoint:`mentor/delete/${mentor_id}`
        }).then(response => {
            mentorsList = response.data.data
        })
    }

    onMount(async () => {
        getMentors()
    })

</script>

<svelte:head>
	<title>Mentors</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="mentor" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">Mentors</h4>
                {#if status}
                <div class="row">
                    <div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Mentors</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <input type="text" class="form-control" id="filter-name" placeholder="Mentor Name">
                                    </div>
                                    <div class="input-group input-group-merge">
                                        <input type="text" class="form-control" id="filter-skill" placeholder="Skills">
                                    </div>
                                    <div class="input-group input-group-merge">
                                        <select id="filter-status" class="form-select">
                                            <option value="" selected>All Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Non-Active">Non-Active</option>
                                        </select>
                                    </div>
                                    <button type="button" class="btn btn-primary text-nowrap" on:click={() => window.location.href = '/super-admin/mentor/create'}>
                                        <span class="tf-icons bx bx-plus me-1"></span>Mentor
                                    </button>
                                </div>
                            </div>
                            <div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th>NO.</th>
											<th>Mentor Name</th>
											<th>Skills</th>
											<th>Number of Groups</th>
											<th>Status</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
                                        {#if mentorsList != null || mentorsList != undefined}
                                        {#if mentorsList.length > 0}
                                        {#each mentorsList as m, i}
                                        <tr>
                                            <td>{i+1}</td>
                                            <td>{m.fullname}</td>
                                            <td>
                                                {#each m.skill as s, i}
                                                {#if i%2 == 0}
                                                <span class="badge bg-label-warning me-1">{s}</span>
                                                {:else}
                                                <span class="badge bg-label-success me-1">{s}</span>
                                                {/if}
                                                {/each}
                                            </td>
                                            <td></td>
                                            <td class="{m.status == 'Active' ? 'text-success' : 'text-danger'}">{m.status}</td>
                                            <td>
                                                <a href="/super-admin/mentor/edit/{m.id}" class="btn btn-sm btn-outline-warning">Edit</a>
                                                <button class="btn btn-sm btn-outline-danger" on:click={() => {
                                                    deleteMentor(m.id)
                                                }}>Delete</button>
                                            </td>
                                        </tr>
                                        {/each}
                                        {/if}
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
        <Footer/>
    </div>  
</div>  