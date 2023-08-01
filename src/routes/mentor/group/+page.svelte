<script>
// @ts-nocheck

	import { onMount } from "svelte";
	import ApiController from "../../../ApiController";
    import Navbar from "../../../components/navbar.svelte";
    import Sidebar from "../../../components/sidebar.svelte";
    import Pagination from "../../../components/pagination.svelte";
    import Footer from "../../../components/footer.svelte";
	import jquery from "jquery";
    import pagination from "../../../CustomPagination";
	import returnNada from "../../../CustomReturnNada";

    let currentPage = 1
    let showRowData = 10
    let groupsReal = null
    let groups = null
    let status = false

    let getGroups = () => {
        ApiController({
            method:"GET",
            endpoint:`groups`
        }).then(response => {
            groupsReal = response?.data.data
            groupsReal = groupsReal.sort((x, y) => x.name < y.name ? -1 : 1)
            groups = groupsReal
            status = true
        })
    }

    let filterAssignment = () => {
        currentPage = 1
        groups = groupsReal
        let tempGroups = groups
        let targetName = jquery('#filter-name').val().toLowerCase()

        tempGroups = tempGroups.filter(m => {
            return m.name.toLowerCase().includes(targetName)
        })

        groups = tempGroups
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
	<Sidebar activePage="group" role='mentor'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='mentor'/>
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
										<input type="text" class="form-control" placeholder="Group Name" id="filter-name" on:keyup={() => {filterAssignment()}}>
                                    </div>
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
										</tr>
									</thead>
									<tbody>
                                    {#if groups.length > 0}
                                    {#if pagination(groups, currentPage, showRowData).length == 0}
                                    {returnNada(currentPage = currentPage-1)}
                                    {/if}
                                    {#each pagination(groups, currentPage, showRowData) as g, i}
                                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                    <tr id="group-{g.id}" on:mouseover={() => jquery(`#group-${g.id}`).css('cursor', 'pointer')}
                                        on:click={() => window.location.href = `/mentor/group/detail/${g.id}`}>
                                        <td class="text-center">{g.number}</td>
                                        <td>{g.name}</td>
                                        <td>{g.program_name}</td>
                                        <td>{g.fullname}</td>
                                        <td class="text-center">{g.numberOfMentee}</td>
                                        <td class="text-center {g.status == 'Active' ? 'text-success' : 'text-danger'}">{g.status}</td>
                                    </tr>
                                    {/each}
                                    {:else}
                                    <tr>
                                        <td colspan="7" class="text-center">No Data</td>
                                    </tr>
                                    {/if}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Pagination bind:currentPage={currentPage} bind:dataList={groups} showRowData={showRowData}/>
                </div>
                {/if}
            </div>
        </div>
        <Footer/>
    </div>
</div>