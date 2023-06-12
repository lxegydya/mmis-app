<script>
// @ts-nocheck

    import Sidebar from "../../../components/sidebar.svelte";
    import Navbar from "../../../components/navbar.svelte";
    import Footer from "../../../components/footer.svelte";
    import Pagination from "../../../components/pagination.svelte";
	import ApiController from "../../../ApiController";
	import { onMount } from "svelte";
	import jquery from "jquery";
	import pagination from "../../../CustomPagination";

    let menteesReal = null
    let menteesList = null
    let menteesTotal = null
    let activeMenteesTotal = null
    let status = false

    let currentPage = 1
    let showRowData = 10

    let getMentees = () => {
        ApiController({
            method: "GET",
            endpoint: `mentees`
        }).then(response => {
            menteesReal = response?.data.data.mentees.sort((a, b) => a.name < b.name ? -1 : 1)
            menteesReal.forEach((m, i) => {
                m.numbering = ++i
            })

            menteesList = menteesReal

            menteesTotal = response?.data.data.mentees_total
            activeMenteesTotal = response?.data.data.active_mentees
            status = true
        })
    }

    let deleteMentee = menteeId => {
        ApiController({
            method:"POST",
            endpoint:`mentee/delete`,
            datas:{mentee_id : menteeId}
        }).then(response => {
            if(response?.data.msg == "success"){
                alert(`Mentee Deleted!`)
                window.location.href = '/super-admin/mentee'
            }
        })
    }

    let excelToDb = () => {
        let formdata = new FormData()
        formdata.append('excel_file', jquery('#import-excel').prop('files')[0])

        ApiController({
            method:'POST',
            endpoint:'mentee/create/from-excel',
            datas:formdata,
            sendForm:true
        }).then(response => {
            if(response?.data.msg == 'success'){
                alert(`Mentees Created!`)
                window.location.href = '/super-admin/mentee'
            }
        })
    }

    let filterMentee = () => {
        menteesList = menteesReal
        let tempMentees = menteesList
        let targetName = jquery('#filter-name').val().toLowerCase()
        let targetUniversity = jquery('#filter-university').val().toLowerCase()

        tempMentees = tempMentees.filter(m => {
            return m.name.toLowerCase().includes(targetName) &&
                m.university.toLowerCase().includes(targetUniversity)
        })

        tempMentees.forEach((m, i) => {
            m.numbering = ++i
        })

        menteesList = tempMentees
    }

    onMount(async () => {
        getMentees()
    })
</script>

<svelte:head>
	<title>Mentees</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="mentee" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					Mentees
				</h4>
                {#if status}
                <div class="row">
                    <div class="col-lg-2 col-md-4 col-6 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="card-title d-flex align-items-start justify-content-between">
                                    <div class="avatar flex-shrink-0">
                                        <img
                                            src="/img/icons/unicons/chart-success.png"
                                            alt="chart success"
                                            class="rounded"
                                        />
                                    </div>
                                </div>
                                <span class="fw-semibold d-block mb-1">Mentees Total</span>
                                <div class="d-flex align-items-center gap-2">
                                    <h3 class="card-title mb-2">{menteesTotal < 10 ? '0' + menteesTotal : menteesTotal}</h3><span class="fw-light d-block mb-1">Mentees</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-4 col-6 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="card-title d-flex align-items-start justify-content-between">
                                    <div class="avatar flex-shrink-0">
                                        <img
                                            src="/img/icons/unicons/chart-success.png"
                                            alt="chart success"
                                            class="rounded"
                                        />
                                    </div>
                                </div>
                                <span class="fw-semibold d-block mb-1">Active Mentees Total</span>
                                <div class="d-flex align-items-center gap-2">
                                    <h3 class="card-title mb-2">{activeMenteesTotal < 10 ? '0' + activeMenteesTotal : activeMenteesTotal}</h3><span class="fw-light d-block mb-1">Mentees</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
					<div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Mentees</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <span class="input-group-text" id="basic-addon-search31"><i class="bx bx-search"></i></span>
										<input type="text" class="form-control" placeholder="Mentee Name" id="filter-name" on:keyup={() => {filterMentee()}}>
                                    </div>
                                    <div class="input-group input-group-merge">
                                        <span class="input-group-text" id="basic-addon-search32"><i class="bx bx-search"></i></span>
										<input type="text" class="form-control" placeholder="University" id="filter-university" on:keyup={() => {filterMentee()}}>
                                    </div>
                                    <button type="button" class="btn btn-outline-secondary text-nowrap" on:click={() => jquery('#import-excel').click()}>
                                        <span class="tf-icons bx bxs-file-import me-1"></span>From Excel
                                        <input type="file" id="import-excel" class="d-none" on:change={() => {
                                            excelToDb()
                                        }} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                                    </button>
                                    <button type="button" class="btn btn-primary text-nowrap" on:click={() => window.location.href = '/super-admin/mentee/create'}>
                                        <span class="tf-icons bx bx-plus me-1"></span>Mentee
                                    </button>
                                </div>
                            </div>
                            <div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th>No</th>
											<th>MSIB ID</th>
											<th>Name</th>
											<th>Gender</th>
											<th>University</th>
											<th>Major</th>
											<th>Semester</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Group Name</th>
                                            <th>Status</th>
                                            <th class="text-center">Action</th>
										</tr>
									</thead>
									<tbody>
                                    {#if menteesList.length > 0}
                                    {#each pagination(menteesList, currentPage, showRowData) as m}
                                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                    <tr id="data-{m.id}" on:click={() => window.location.href = `/super-admin/mentee/detail/${m.id}`}
                                        on:mouseover={() => jquery(`#data-${m.id}`).css('cursor', 'pointer')}>
                                        <td class="text-center">{m.numbering}</td>
                                        <td>{m.id}</td>
                                        <td>{m.name}</td>
                                        <td class="text-center">{m.gender}</td>
                                        <td>{m.university}</td>
                                        <td>{m.major}</td>
                                        <td class="text-center">{m.semester}</td>
                                        <td>{m.email}</td>
                                        <td>{m.phone}</td>
                                        <td class="text-center {m.group_name == null ? 'text-danger' : ''}">
                                            {m.group_name == null ? 'Not Assign Yet' : m.group_name}
                                        </td>
                                        <td class="text-center {m.status == 'Active' ? 'text-success' : 'text-danger'}">{m.status}</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-warning" on:click={(event) => {
                                                event.stopPropagation()
                                                window.location.href = `/super-admin/mentee/edit/${m.id}`
                                            }}>Edit</button>
                                            <button class="btn btn-sm btn-outline-danger" on:click={(event) => {
                                                event.stopPropagation()
                                                deleteMentee(m.id)
                                            }}>Delete</button>
                                        </td>
                                    </tr>
                                    {/each}
                                    {/if}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Pagination bind:currentPage={currentPage} bind:dataList={menteesList} showRowData=10 position='end'/>
                </div>
                {/if}
            </div>
        </div>
        <Footer/>
    </div>
</div>