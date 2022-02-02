import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OffersService} from '../../../services/offers.service';
import {mimeTypeValidator} from "./mime-type.validator";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from 'rxjs';
import {MatDialog} from "@angular/material/dialog";
import {DeleteProductComponent} from "./delete-product/delete-product.component";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.less']
})

export class AddProductComponent implements OnInit {
  public productButton = {
    addProduct: "Добавить",
    deleteProduct: "Удалить",
    editProduct: "Изменить",
    cancelProduct: "Отменить",
  }
  public _form?: FormGroup | undefined;
  public _imagePreview: string | undefined;
  public reloadTrigger$: Observable<any> | undefined;
  public productForEdit: any | undefined;
  public isChange: boolean = false;
  public page: any;

  constructor(
    private offersService: OffersService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
  }

  public get pictures() {
    return this._form?.get("image")
  }

  public get description() {
    return this._form?.get("description")
  }

  public get designer() {
    return this._form?.get("designer")
  }

  public get price() {
    return this._form?.get("price")
  }

  public get category() {
    return this._form?.get("category")
  }

  public get name() {
    return this._form?.get("name")
  }

  public get availability() {
    return this._form?.get("availability")
  }

  public get partNumber() {
    return this._form?.get("partNumber")
  }

  ngOnInit(): void {
    this._form = this.formBuilder.group({
      description: [null, Validators.required],
      designer: [null, Validators.required],
      price: [null, Validators.required],
      category: [null, Validators.required],
      name: [null, Validators.required],
      availability: [null, Validators.required],
      partNumber: [null, Validators.required],
      image: [null, Validators.required, mimeTypeValidator],
    });
    this.reloadTrigger$ = this.offersService.getOffers();
  }

  public _addProduct(): void {
    this.offersService.addProduct(
      this._form?.value.description,
      this._form?.value.designer,
      this._form?.value.price,
      this._form?.value.category,
      this._form?.value.name,
      this._form?.value.availability,
      this._form?.value.partNumber,
      this._form?.value.image)
      .subscribe(() => {
        this._form?.reset()
        this._snackBar.open('Успешно добавлено', 'Закрыть', {
          duration: 3000
        });
      })
  }

  public _onImageChecked(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.length && files[0];
    this._form?.patchValue({image: file});
    this._form?.get("image")?.updateValueAndValidity();
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this._imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  deleteProduct(partNumber: number) {
    this.offersService.deleteProduct(partNumber).subscribe(() => {
      console.log(partNumber)
    });
    window.scrollTo(0, 300);
  }

  public openDialog(partNumber: number) {
      this.dialog.open(DeleteProductComponent).afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(partNumber);
      } else if (!result) {
        this.dialog.closeAll();
      }
    })
  }

  editProduct(partNumber: number) {
    this.productForEdit = this.offersService.getSpecificProduct(partNumber).subscribe(
      async (of) => {
        const response = await fetch(of.img);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', {type: blob.type});
        this._imagePreview = of.img;
        this._form?.setValue({
          description: of.description,
          designer: of.designer,
          price: of.price,
          category: of.category,
          name: of.name,
          availability: of.availability,
          partNumber: of.partNumber,
          image: file,
        })
        this.isChange = true;
        window.scrollTo(0, 0);
  }
    )
  }

  submitEditProduct(partNumber: number) {
    this.offersService.editProduct(
      this._form?.value.description,
      this._form?.value.designer,
      this._form?.value.price,
      this._form?.value.category,
      this._form?.value.name,
      this._form?.value.availability,
      this._form?.value.partNumber,
      this._form?.value.image).subscribe(() => {
      this._form?.reset()
      this._imagePreview = undefined
      this._snackBar.open('Товар успешно обновлён', 'Закрать', {
        duration: 3000
      });
      this.isChange = false;
    });
  }

  clearForm() {
    this._form?.reset()
    this._imagePreview = undefined
    this.isChange = false
  }

  pageClick() {
    window.scrollTo(0, 0);
  }
}
