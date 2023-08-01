<script>
// @ts-nocheck

	import { onMount } from "svelte";
	import ApiController from "../../../ApiController";
    import Navbar from "../../../components/navbar.svelte";
    import Sidebar from "../../../components/sidebar.svelte";
    import Footer from "../../../components/footer.svelte";
    import jquery from "jquery";
    import Pagination from "../../../components/pagination.svelte";
    import pagination from "../../../CustomPagination";
	import returnNada from "../../../CustomReturnNada";

    let currentPage = 1
    let showRowData = 10

    let mentorsListReal = null
    let mentorsList = null
    let status = false

    let getMentors = () => {
        ApiController({
            method:"GET",
            endpoint:`mentors`
        }).then(response => {
            mentorsListReal = response.data.data
            mentorsList = mentorsListReal

            console.log(mentorsList)

            status = true
        })
    }

    let filterMentor = () => {
        currentPage = 1
        mentorsList = mentorsListReal
        let tempMentor = mentorsList
        let targetName = jquery('#filter-name').val().toLowerCase()
        let targetStatus = jquery('#filter-status').val().toLowerCase()

        tempMentor = tempMentor.filter(m => {
            return m.fullname.toLowerCase().includes(targetName) &&
                m.status.toLowerCase().includes(targetStatus)
        })

        mentorsList = tempMentor
    }

    onMount(async () => {
        getMentors()
    })

</script>

<svelte:head>
	<title>Mentors</title>
	<html lang="en" />

    <style>
        tr:hover{
            cursor: pointer;
        }
    </style>

</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="mentor" role='mentor'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='mentor'/>
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
                                        <input type="text" class="form-control" id="filter-name" placeholder="Mentor Name" on:keyup={() => {filterMentor()}}>
                                    </div>
                                    <div class="input-group input-group-merge">
                                        <select id="filter-status" class="form-select" on:change={() => {filterMentor()}}>
                                            <option value="" selected>All Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Non-Active">Non-Active</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th>NO.</th>
											<th>Mentor Name</th>
											<th>Skills</th>
											<th class="text-center">Number of Groups</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
                                        {#if mentorsList.length > 0}
                                        {#if pagination(mentorsList, currentPage, showRowData).length == 0}
                                        {returnNada(--currentPage)}
                                        {/if}
                                        {#each pagination(mentorsList, currentPage, showRowData) as m, i}
                                        <tr>
                                            <td>{m.number}</td>
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
                                            <td class="text-center">{m.group_count}</td>
                                            <td class="{m.status == 'Active' ? 'text-success' : 'text-danger'}">{m.status}</td>
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
                        <Pagination bind:currentPage={currentPage} bind:dataList={mentorsList} showRowData={showRowData} />
                    </div>
                </div>
                {/if}
            </div>
        </div>  
        <Footer/>
    </div>  
</div>  