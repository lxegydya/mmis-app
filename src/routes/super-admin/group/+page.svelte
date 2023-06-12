<script>
// @ts-nocheck

	import { onMount } from "svelte";
	import ApiController from "../../../ApiController";
    import Navbar from "../../../components/navbar.svelte";
    import Sidebar from "../../../components/sidebar.svelte";
    import Footer from "../../../components/footer.svelte";
	import jquery from "jquery";

    let groups = null
    let status = false

    let getGroups = () => {
        ApiController({
            method:"GET",
            endpoint:`groups`
        }).then(response => {
            groups = response?.data.data
            groups = groups.sort((x, y) => {
                if(x.name.toLowerCase() > y.name.toLowerCase() || x.program_name.toLowerCase() > y.program_name.toLowerCase()){
                    return 1
                }

                if(x.name.toLowerCase() < y.name.toLowerCase() || x.program_name.toLowerCase() < y.program_name.toLowerCase()){
                    return -1
                }
            })
            
            status = true
        })
    }

    onMount(async () => {
        getGroups()
    })

</script>

<svelte:head>
	<title>Groups</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="group" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					Groups
				</h4>
                {#if status}
                <div class="row">
                    <div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Groups</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <span class="input-group-text" id="basic-addon-search31"><i class="bx bx-search"></i></span>
										<input type="text" class="form-control" placeholder="Group Name" id="filter-name">
                                    </div>
                                    <button type="button" class="btn btn-primary text-nowrap" on:click={() => window.location.href = '/super-admin/group/create'}>
                                        <span class="tf-icons bx bx-plus me-1"></span>Group
                                    </button>
                                </div>
                            </div>
                            <div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th>No</th>
											<th>Group Name</th>
											<th>Program</th>
											<th>Mentor's Name</th>
											<th>Number of Mentees</th>
                                            <th>Status</th>
                                            <th>Action</th>
										</tr>
									</thead>
									<tbody>
                                    {#each groups as g, i}
                                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                    <tr id="group-{g.id}" on:mouseover={() => jquery(`#group-${g.id}`).css('cursor', 'pointer')}
                                        on:click={() => window.location.href = `/super-admin/group/detail/${g.id}`}>
                                        <td class="text-center">{i+1}</td>
                                        <td>{g.name}</td>
                                        <td>{g.program_name}</td>
                                        <td>{g.fullname}</td>
                                        <td class="text-center">{g.numberOfMentee}</td>
                                        <td class="text-center {g.status == 'Active' ? 'text-success' : 'text-danger'}">{g.status}</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-warning" on:click={(evt) => {
                                                evt.stopPropagation()
                                            }}>Edit</button>
                                            <button class="btn btn-sm btn-outline-danger" on:click={(evt) => {
                                                evt.stopPropagation()
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
        <Footer/>
    </div>
</div>