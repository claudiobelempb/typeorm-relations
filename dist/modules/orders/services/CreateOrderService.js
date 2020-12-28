"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tsyringe_1 = require("tsyringe");
var AppError_1 = __importDefault(require("@shared/errors/AppError"));
var CreateProductService = /** @class */ (function () {
    function CreateProductService(ordersRepository, productsRepository, customersRepository) {
        this.ordersRepository = ordersRepository;
        this.productsRepository = productsRepository;
        this.customersRepository = customersRepository;
    }
    CreateProductService.prototype.execute = function (_a) {
        var customer_id = _a.customer_id, products = _a.products;
        return __awaiter(this, void 0, void 0, function () {
            var customerExist, productsId, findProducts, updatedQuantities, updatedProducts, order;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.customersRepository.findById(customer_id)];
                    case 1:
                        customerExist = _b.sent();
                        if (!customerExist) {
                            throw new AppError_1.default('This customer does not exists');
                        }
                        productsId = products.map(function (product) { return ({ id: product.id }); });
                        return [4 /*yield*/, this.productsRepository.findAllById(productsId)];
                    case 2:
                        findProducts = _b.sent();
                        if (findProducts.length !== products.length) {
                            throw new AppError_1.default('One or more products was not found');
                        }
                        updatedQuantities = [];
                        updatedProducts = findProducts.map(function (findProduct) {
                            var orderProduct = products.find(function (product) { return product.id === findProduct.id; });
                            if (orderProduct) {
                                if (findProduct.quantity < orderProduct.quantity) {
                                    throw new AppError_1.default("\n              Product " + findProduct.name + " has quantity available in stock: " + findProduct.quantity + "\n\n              Quantity requested: " + orderProduct.quantity + "\n            ");
                                }
                                updatedQuantities.push({
                                    id: orderProduct.id,
                                    quantity: findProduct.quantity - orderProduct.quantity,
                                });
                                return __assign(__assign({}, findProduct), { quantity: orderProduct.quantity });
                            }
                            return findProduct;
                        });
                        return [4 /*yield*/, this.productsRepository.updateQuantity(updatedQuantities)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.ordersRepository.create({
                                customer: customerExist,
                                products: updatedProducts.map(function (product) { return ({
                                    product_id: product.id,
                                    price: product.price,
                                    quantity: product.quantity,
                                }); }),
                            })];
                    case 4:
                        order = _b.sent();
                        return [2 /*return*/, order];
                }
            });
        });
    };
    CreateProductService = __decorate([
        tsyringe_1.injectable(),
        __param(0, tsyringe_1.inject('OrdersRepository')),
        __param(1, tsyringe_1.inject('ProductsRepository')),
        __param(2, tsyringe_1.inject('CustomersRepository')),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], CreateProductService);
    return CreateProductService;
}());
exports.default = CreateProductService;
