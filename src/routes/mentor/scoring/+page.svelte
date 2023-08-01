<script>
// @ts-nocheck

    import Sidebar from "../../../components/sidebar.svelte";
    import Navbar from "../../../components/navbar.svelte";
    import Footer from "../../../components/footer.svelte";
    import Pagination from "../../../components/pagination.svelte";
    import { onMount } from "svelte";
    import jquery from "jquery";
    import pagination from "../../../CustomPagination";
    import toDate from "../../../CustomTime";
	import ApiController from "../../../ApiController";
	import returnNada from "../../../CustomReturnNada";
    import Cookie from 'js-cookie'

    let currentPage = 1
    let showRowData = 10

    let batches = null
    let programsReal = null
    let programs = null
    let status = false

    let getData = () => {
        ApiController({
            method:"POST",
            endpoint:'assignment/mentor/program',
            datas:{
                mentor_id : Cookie.get('token')
            }
        }).then(response => {
            batches = response?.data.data.batches
            programsReal = response?.data.data.programs
            programs = response?.data.data.programs
            status = true
        })
    }

    let filterProgram = () => {
        currentPage = 1
        programs = programsReal
        let tempProgram = programs
        let targetName = jquery('#filter-name').val().toLowerCase()
        let targetBatch = jquery('#filter-batch').val().toLowerCase()

        tempProgram = tempProgram.filter(m => {
            return m.program_name.toLowerCase().includes(targetName) &&
                m.batch_name.toLowerCase().includes(targetBatch)
        })

        programs = tempProgram
    }

    onMount(async () => {
        getData()
    })

</script>

<svelte:head>
	<title>Scorings</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="scoring" role='mentor'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='mentor'/>
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					Scorings
				</h4>
                {#if status}
                <div class="row mb-3">
                    <div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Choose Program</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <input type="text" class="form-control" id="filter-name" placeholder="Program Name" on:keyup={() => filterProgram()}>
                                    </div>
									<div class="input-group">
                                        <select id="filter-batch" class="form-select" on:change={() => filterProgram()}>
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
                <div class="row mb-3">
                    {#if pagination(programs, currentPage, showRowData).length == 0}
                    {returnNada(currentPage = currentPage-1)}
                    {/if}
                    {#each pagination(programs, currentPage, 8) as p}
                    <div class="col-lg-6 col-md-12 mb-4">
                        <a href="/mentor/scoring/list/{p.program_id}" class="rounded bg-white list-group-item list-group-item-action flex-column align-items-start h-100">
                            <div class="d-flex justify-content-between w-100 mb-3">
                                <p class="mb-0">{p.batch_name}</p>
                                <div>
                                    <span class="ms-2 badge rounded-pill px-3 bg-label-info">{p.assignment_count} Assignments</span>
                                </div>
                            </div>
                            <h3 class="mb-1">{p.program_name}</h3>
                            {#if p.program_status == 'Upcoming'}
                            <p class="lead mb-0 text-secondary">{p.program_status}</p>
                            {:else if p.program_status == 'Ongoing'}
                            <p class="lead mb-0 text-warning">{p.program_status}</p>
                            {:else if p.program_status == 'Finished'}
                            <p class="lead mb-0 text-success">{p.program_status}</p>
                            {/if}
                        </a>
                    </div>
                    {/each}
                    <Pagination bind:currentPage={currentPage} bind:dataList={programs} showRowData=8/>
                </div>
                {/if}
            </div>
        </div>
        <Footer/>
    </div>
</div>