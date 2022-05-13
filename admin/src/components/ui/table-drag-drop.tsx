import React from 'react'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import BaseTable, { Column } from 'react-base-table'
import 'react-base-table/styles.css'


const DraggableContainer = SortableContainer(({ children }) => children)
const DraggableElement = SortableElement(({ children }) => children)
const DraggableHandle = SortableHandle(({ children }) => children)

const columns = [
  {
    key: 'id',
    title: 'ID',
    dataKey: 'id',
    width: 100,
    resizable: true,
    sortable: true,
    frozen: Column.FrozenDirection.LEFT,
  },
  {
    key: 'name',
    title: 'Nome',
    dataKey: 'name',
    width: 300,
    align: Column.Alignment.CENTER,
    sortable: false,
  },
  {
    key: 'details',
    title: 'Detalhes',
    dataKey: 'details',
    width: 100,
    align: Column.Alignment.CENTER,
    sortable: false,
  },
  {
    key: 'image',
    title: 'Imagem',
    dataKey: 'image',
    width: 100,
    align: Column.Alignment.CENTER,
    sortable: false,
  },
  {
    key: 'icon',
    title: 'Icon',
    dataKey: 'icon',
    width: 100,
    align: Column.Alignment.CENTER,
    sortable: false,
  },
  {
    key: 'slug',
    title: 'Slug',
    dataKey: 'slug',
    width: 100,
    align: Column.Alignment.CENTER,
    sortable: false,
  },
  {
    key: 'actions',
    title: 'Ação',
    dataKey: 'actions',
    width: 100,
    align: Column.Alignment.CENTER,
    frozen: Column.FrozenDirection.RIGHT,
    cellRenderer: ({ rowData } : any) => (
      <button
        onClick={() => {
          this.setState({
            data: this.state.data.filter(x => x.id !== rowData.id),
          })
        }}
      >
        Remove
      </button>
    ),
  },
]

class DraggableTable extends React.PureComponent {
  state = {
    data: this.props.data,
  }

  table = React.createRef()

  getContainer = () => {
    // for fixed table with frozen columns, the drag handle is in the left frozen table
    return this.table.current
      .getDOMNode()
      .querySelector('.BaseTable__table-frozen-left .BaseTable__body')
  }

  getHelperContainer = () => {
    return this.table.current
      .getDOMNode()
      .querySelector('.BaseTable__table-frozen-left')
  }

  rowProps = args => {
    // don't forget to passing the incoming rowProps
    const extraProps = callOrReturn(this.props.rowProps)
    return {
      ...extraProps,
      tagName: Row,
      index: args.rowIndex,
    }
  }

  handleSortEnd = ({ oldIndex, newIndex }) => {
    const data = [...this.state.data]
    const [removed] = data.splice(oldIndex, 1)
    data.splice(newIndex, 0, removed)
    this.setState({ data })
  }

  render() {
    return (
      <DraggableContainer
        useDragHandle
        getContainer={this.getContainer}
        helperContainer={this.getHelperContainer}
        onSortEnd={this.handleSortEnd}
      >
        <BaseTable
          width={1200}
          style={{width:'100%'}}          
          {...this.props}
          ref={this.table}
          data={this.state.data}
          fixed={true}
          rowProps={this.rowProps}
        />
      </DraggableContainer>
    )
  }
}


const Table2 = ({ data} : { data: Array<any>}) =>{
  return <>
  
  <BaseTable fixed={true} columns={columns} data={data} style={{width:'100%'}} height={400} />
  </>
};


export default DraggableTable;