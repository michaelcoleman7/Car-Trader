import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import {PostadvertService} from '../services/postadvert.service';


@Component({
  selector: 'app-edit-car-ad',
  templateUrl: './edit-car-ad.component.html',
  styleUrls: ['./edit-car-ad.component.css']
})
export class EditCarAdComponent implements OnInit {
    carPost: any = [];
    photoBinaryString:string="";
    //convert photo into base64
    // adapted from https://stackoverflow.com/questions/42482951/converting-an-image-to-base64-in-angular-2
    handleFileSelect(evt){
        var files = evt.target.files;//can be found in file(evt) array returned by selecting file, can viewed in console by logging evt
        var file = files[0];
      
      if (files && file) {
          var reader = new FileReader();

          reader.onload =this.handleReaderLoaded.bind(this);//call below method handleReaderLoaded

          reader.readAsBinaryString(file);
      }
    }

  handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
            //btoa() converts string to base 64
            this.photoBinaryString= btoa(binaryString);
    }
  
  constructor(private route: ActivatedRoute,private service:PostadvertService,private router:Router) { 
  }

  ngOnInit() {
    //use activated route to get id(as parameter) from route to allow edit of post
    this.service.getPost(this.route.snapshot.params['id']).subscribe(data =>{
        this.carPost = data;
    });

  }
  //used when form is submitted by user, to submit info to  mongodb via service and server to edit current post
  onEditPost(form: NgForm){
    form.value.photo = this.photoBinaryString;
    this.service.updateCar(this.carPost._id,form.value.name, form.value.password,form.value.phone,form.value.email, form.value.make, form.value.model, form.value.year, form.value.price, 
      form.value.colour, form.value.fuel, form.value.photo).subscribe(() =>
      {
        //navigate to home page
        this.router.navigate(['/home']);
      });
  }
}
