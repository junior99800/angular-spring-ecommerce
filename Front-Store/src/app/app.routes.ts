import { Routes } from '@angular/router';
import { Template } from './template/template'; 
import { Catalogo } from './catalogo/catalogo';
import { Productdescription } from './productdescription/productdescription';
import { Login } from './auth/login/login';
import { Crudproduto } from './crud-produto/crud-produto'; 
import { authGuard } from './auth.guard';
import { EditarProduto } from './crud-produto/editar-produto/editar-produto';
import { CadastroProduto } from './crud-produto/cadastro-produto/cadastro-produto';

export const routes: Routes = [
    { path: '', redirectTo: 'paginas', pathMatch: 'full' }, 
    { path: 'paginas', component: Template },
    { path: 'catalogo', component: Catalogo },
    { path: 'catalogo/:id', component: Productdescription },
    { path: 'login', component: Login },
    
    // Adicionado a vírgula aqui no final da linha abaixo:
    { path: 'admin/produtos', component: Crudproduto, canActivate: [authGuard] }, 
    { path: 'admin/produtos/novo', component: CadastroProduto, canActivate: [authGuard] },
    { path: 'admin/produtos/editar/:id', component: EditarProduto, canActivate: [authGuard] }
];