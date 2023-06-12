<script>
// @ts-nocheck

	import { onMount } from "svelte";
	import ApiController from "../../../../../ApiController";
    import Navbar from "../../../../../components/navbar.svelte";
    import Sidebar from "../../../../../components/sidebar.svelte";
    import Footer from "../../../../../components/footer.svelte";
    import jquery from "jquery";

    export let data

    let mentee = null
    let status = false

    let getMentee = () => {
        ApiController({
            method:"POST",
            endpoint:`mentee/detail`,
            datas:{mentee_id:data.params.slug}
        }).then(response => {
            mentee = response?.data.data
            status = true

            console.log(mentee)
        })
    }

    onMount(async () => {
        getMentee()
    })
</script>

<svelte:head>
	<title>Mentees | Detail</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="mentee" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-mouse-events-have-key-events -->
					<span
						id="nav-back-link"
						class="text-muted fw-light"
						on:click={() => {
							window.history.back();
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Mentees /</span
					> Detail
				</h4>
                {#if status}
                <div class="row">
                    <div class="col-md-10">
                        <div class="card mb-3">
                            <div class="row g-0">
                                <div class="col-md-4">
                                    <!-- svelte-ignore a11y-img-redundant-alt -->
                                    <img class="card-img card-img-left" src="http://127.0.0.1/mmis-api/public/{mentee.image}" alt="Card image">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <h5 class="card-title mb-0">{mentee.name}</h5>
                                            <div class="d-flex gap-2">
                                                <button class="btn btn-sm btn-outline-warning" on:click={() => window.location.href = `/super-admin/mentee/edit/${mentee.id}`}>Edit</button>
                                                <button class="btn btn-sm btn-outline-danger">Delete</button>
                                            </div>
                                        </div>
                                        <p class="card-text"><small class="text-muted">Program: blablabla</small></p>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">MSIB ID</p>
                                                <p class="lead mb-0">{mentee.id}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Status</p>
                                                {#if mentee.status == 'Active'}
                                                <span class="badge bg-label-success">{mentee.status}</span>
                                                {:else}
                                                <span class="badge bg-label-danger">{mentee.status}</span>
                                                {/if}
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Email</p>
                                                <p class="lead mb-0">{mentee.email}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Phone</p>
                                                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                                <p id="phone-number" class="lead mb-0" on:mouseover={() => {
                                                    jquery('#phone-number').css('cursor', 'pointer')
                                                }} on:click={() => window.open(`https://wa.me/62${mentee.phone}`, '_blank')}>{mentee.phone}</p>
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Gender</p>
                                                <p class="lead mb-0">{mentee.gender}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">University</p>
                                                <p class="lead mb-0">{mentee.university}</p>
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Major</p>
                                                <p class="lead mb-0">{mentee.major}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Semester</p>
                                                <p class="lead mb-0">{mentee.semester}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion mt-3" id="accordionExample">
                    <div class="card accordion-item">
                        <h2 class="accordion-header" id="headingOne">
                        <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#accordionOne" aria-expanded="false" aria-controls="accordionOne">
                            Assignment Score
                        </button>
                        </h2>
                
                        <div id="accordionOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample" style="">
                        <div class="accordion-body">
                            Lemon drops chocolate cake gummies carrot cake chupa chups muffin topping. Sesame snaps icing marzipan gummi
                            bears macaroon dragée danish caramels powder. Bear claw dragée pastry topping soufflé. Wafer gummi bears
                            marshmallow pastry pie.
                        </div>
                        </div>
                    </div>
                    <div class="card accordion-item">
                        <h2 class="accordion-header" id="headingTwo">
                        <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#accordionTwo" aria-expanded="false" aria-controls="accordionTwo">
                            Activity Absence
                        </button>
                        </h2>
                        <div id="accordionTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample" style="">
                        <div class="accordion-body">
                            Dessert ice cream donut oat cake jelly-o pie sugar plum cheesecake. Bear claw dragée oat cake dragée ice
                            cream halvah tootsie roll. Danish cake oat cake pie macaroon tart donut gummies. Jelly beans candy canes
                            carrot cake. Fruitcake chocolate chupa chups.
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