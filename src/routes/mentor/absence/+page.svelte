<script>
// @ts-nocheck

    import Sidebar from "../../../components/sidebar.svelte";
    import Navbar from "../../../components/navbar.svelte";
    import Footer from "../../../components/footer.svelte";
    import ApiController from "../../../ApiController";
	import { onMount } from "svelte";
    import jquery from "jquery";
    import pagination from "../../../CustomPagination";
    import Pagination from "../../../components/pagination.svelte";
	import returnNada from "../../../CustomReturnNada";
    import Cookie from 'js-cookie'

    let currentPage = 1
    let status = false
    let data = null
    let programReal = null
    let program = null
    let batches = null
    let showRowData = 8

    let getData = (mentor_id) => {
        ApiController({
            method:"POST",
            endpoint:'absence/mentor/list',
            datas: {
                mentor_id
            }
        }).then(response => {
            data = response?.data.data
            programReal = data.programs
            program = data.programs
            batches = data.batches
            status = true
        })
    }

    let filterProgram = () => {
        currentPage = 1
        program = programReal
        let tempProgram = program
        let targetName = jquery('#filter-name').val().toLowerCase()
        let targetBatch = jquery('#filter-batch').val().toLowerCase()

        tempProgram = tempProgram.filter(m => {
            return m.program_name.toLowerCase().includes(targetName) &&
                m.batch_name.toLowerCase().includes(targetBatch)
        })

        program = tempProgram
    }

    onMount(async () => {
        let mentor_id = Cookie.get('token')
        getData(mentor_id)
    })
</script>

<svelte:head>
	<title>Absences</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="absence" role='mentor' />
	<div class="w-100 d-flex flex-column">
		<Navbar role='mentor'/>
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
                                        <input type="text" class="form-control" id="filter-name" placeholder="Program Name" on:keyup={() => {filterProgram()}}>
                                    </div>
									<div class="input-group">
                                        <select id="filter-batch" class="form-select" on:change={() => {filterProgram()}}>
                                            <option value="" selected>All Batches</option>
                                            {#each batches as b}
                                            <option value="{b.batch_name}">{b.batch_name}</option>
                                            {/each}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    {#if pagination(program, currentPage, showRowData).length == 0}
                    {returnNada(currentPage = currentPage-1)}
                    {/if}
                    {#each pagination(program, currentPage, showRowData) as d}
                    <div class="col-lg-6 col-md-12 mb-4">
                        <a href="/mentor/absence/fill-absence/{d.program_id}" class="rounded bg-white list-group-item list-group-item-action flex-column align-items-start h-100">
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
                    <Pagination bind:currentPage={currentPage} bind:dataList={program} showRowData={showRowData}/>
                </div>
                {/if}
            </div>
        </div>
        <Footer/>
    </div>
</div>